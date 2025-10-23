// Otter Order Material Generator - Main Plugin Logic

// Show UI
figma.showUI(__html__, {
  width: 400,
  height: 600,
  title: "Otter Order Generator",
  themeColors: true
});

// Message handling types
interface PluginMessage {
  type: string;
  data?: any;
}

// Template storage
interface StoredTemplate {
  id: string;
  name: string;
  designName: string; // e.g., "Design 1", "Design 2"
  textLayers: {
    poster_copy?: string[];
    flyer_copy?: string[];
  };
}

interface CSVRow {
  [key: string]: string;
}

interface GenerationOptions {
  generatePosters: boolean;
  generateFlyers: boolean;
  groupByBrand: boolean;
}

// Helper Functions
function processTextReplacements(
  text: string,
  storeName: string,
  discountAmount: string
): string {
  let result = text;

  // Replace store name placeholder
  result = result.replace(/\[식당이름\]/g, storeName);

  // Replace discount placeholder (remove entirely if empty)
  if (discountAmount && discountAmount.trim() !== '') {
    result = result.replace(/\[\{n,000원\}\]/g, discountAmount);
  } else {
    result = result.replace(/\[\{n,000원\}\]/g, '');
  }

  return result.trim();
}

function mapDesignOption(option: string): string {
  // Convert "옵션 1" → "Design 1", "옵션 2" → "Design 2", etc.
  const match = option.match(/옵션\s*(\d+)/);
  if (!match) {
    throw new Error(`Invalid design option format: "${option}". Expected format: "옵션 1", "옵션 2", etc.`);
  }
  return `Design ${match[1]}`;
}

// Handle messages from UI
figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    switch (msg.type) {
      case 'add-template':
        await handleAddTemplate(msg.data);
        break;

      case 'validate-templates':
        await validateAllTemplates();
        break;

      case 'generate-materials':
        await generateMaterials(msg.data);
        break;

      case 'export-as-png':
        await exportAsPNG(msg.data);
        break;

      case 'get-stored-templates':
        await getStoredTemplates();
        break;

      case 'clear-all-templates':
        await clearAllTemplates();
        break;

      case 'cancel':
        figma.closePlugin();
        break;
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

async function handleAddTemplate(data: { type: 'poster' | 'flyer', designName: string }) {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1 || selection[0].type !== 'FRAME') {
    figma.ui.postMessage({
      type: 'error',
      message: 'Please select exactly one frame to use as a template'
    });
    return;
  }

  const frame = selection[0] as FrameNode;

  // Find text layers with placeholders based on template type
  const textLayers: {
    poster_copy?: string[];
    flyer_copy?: string[];
  } = {};

  const placeholderToFind = data.type === 'poster' ? '{poster_copy}' : '{flyer_copy}';
  const placeholderKey = data.type === 'poster' ? 'poster_copy' : 'flyer_copy';

  const findTextLayers = (node: SceneNode) => {
    if (node.type === 'TEXT') {
      const text = node.characters;
      if (text.includes(placeholderToFind)) {
        if (!textLayers[placeholderKey]) textLayers[placeholderKey] = [];
        textLayers[placeholderKey]!.push(node.id);
      }
    }
    if ('children' in node) {
      node.children.forEach(findTextLayers);
    }
  };

  findTextLayers(frame);

  // Validate that we found the required placeholder
  if (!textLayers[placeholderKey] || textLayers[placeholderKey]!.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      message: `${data.type === 'poster' ? 'Poster' : 'Flyer'} template must contain ${placeholderToFind} placeholder`
    });
    return;
  }

  // Store template reference
  const template: StoredTemplate = {
    id: frame.id,
    name: frame.name,
    designName: data.designName,
    textLayers
  };

  // Save to plugin data
  const key = `${data.type}_template_${data.designName}`;
  await figma.clientStorage.setAsync(key, template);

  figma.ui.postMessage({
    type: 'template-added',
    data: { ...template, templateType: data.type }
  });

  figma.notify(`✓ Template "${data.designName}" added successfully`);
}

async function validateAllTemplates() {
  const keys = await figma.clientStorage.keysAsync();
  const templateKeys = keys.filter(k => k.startsWith('poster_template_') || k.startsWith('flyer_template_'));

  let valid = 0;
  let invalid = 0;

  for (const key of templateKeys) {
    const template = await figma.clientStorage.getAsync(key) as StoredTemplate;
    const frame = figma.getNodeById(template.id);

    if (!frame) {
      invalid++;
      figma.ui.postMessage({
        type: 'template-validation-error',
        data: { key, error: 'Frame no longer exists' }
      });
    } else {
      valid++;
    }
  }

  figma.ui.postMessage({
    type: 'validation-complete',
    data: { valid, invalid, total: templateKeys.length }
  });

  if (invalid > 0) {
    figma.notify(`⚠️ ${invalid} template(s) invalid. Please re-add them.`, { error: true });
  } else {
    figma.notify(`✓ All ${valid} template(s) are valid`);
  }
}

async function generateMaterials(data: {
  csvData: CSVRow[],
  options: GenerationOptions
}) {
  const { csvData, options } = data;
  let processed = 0;
  const itemsPerRow = (options.generatePosters ? 1 : 0) + (options.generateFlyers ? 1 : 0);
  const total = csvData.length * itemsPerRow;

  // Create a container frame for all generated materials
  const mainContainer = figma.createFrame();
  mainContainer.name = `Otter Order Materials - ${new Date().toLocaleDateString('ko-KR')}`;
  mainContainer.layoutMode = 'VERTICAL';
  mainContainer.layoutSizingHorizontal = 'HUG';
  mainContainer.layoutSizingVertical = 'HUG';
  mainContainer.itemSpacing = 40;
  mainContainer.paddingLeft = mainContainer.paddingRight = 40;
  mainContainer.paddingTop = mainContainer.paddingBottom = 40;
  figma.currentPage.appendChild(mainContainer);

  const errors: string[] = [];
  const generatedNodeIds: string[] = [];

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];

    try {
      // Extract data from CSV row using exact column names
      const websiteUrl = row["오터오더 사이트"] || '';
      const storeName = row["오터오더를 사용하려는 브랜드 이름을 알려주세요. (여러개인 경우 , 로 구분하여 입력)"];
      const posterDesign = row["[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)"];
      const posterCopyRaw = row["포스터에 들어갈 문구를 선택하세요."] || '';
      const flyerDesign = row["[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)"];
      const flyerCopyRaw = row["전단지에 들어갈 문구를 선택하세요."] || '';
      const discountAmount = row["전단지에 삽입할 주문 건별 할인 예정 금액을 알려주세요."] || '';

      // Validate store name
      if (!storeName || storeName.trim() === '') {
        errors.push(`Row ${i + 1}: Missing store name, skipping`);
        console.warn(`Row ${i + 1}: Missing store name, skipping`);
        continue;
      }

      // Process text replacements
      const posterCopy = processTextReplacements(posterCopyRaw, storeName, discountAmount);
      const flyerCopy = processTextReplacements(flyerCopyRaw, storeName, discountAmount);

      // Create container for this brand
      let brandContainer: FrameNode | null = null;
      if (options.groupByBrand) {
        brandContainer = figma.createFrame();
        brandContainer.name = `${storeName} - Materials`;
        brandContainer.layoutMode = 'HORIZONTAL';
        brandContainer.layoutSizingHorizontal = 'HUG';
        brandContainer.layoutSizingVertical = 'HUG';
        brandContainer.itemSpacing = 20;
        brandContainer.paddingLeft = brandContainer.paddingRight = 20;
        brandContainer.paddingTop = brandContainer.paddingBottom = 20;
        mainContainer.appendChild(brandContainer);
      }

      // Generate poster if selected
      if (options.generatePosters && posterDesign) {
        try {
          const mappedPosterDesign = mapDesignOption(posterDesign);
          const posterFrame = await generatePoster(
            storeName,
            mappedPosterDesign,
            posterCopy,
            brandContainer || mainContainer
          );
          // Store website URL for future QR code feature
          posterFrame.setPluginData('websiteUrl', websiteUrl);
          generatedNodeIds.push(posterFrame.id);
          processed++;
          updateProgress(processed, total);
        } catch (error) {
          const errorMsg = `Poster for ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Generate flyer if selected
      if (options.generateFlyers && flyerDesign) {
        try {
          const mappedFlyerDesign = mapDesignOption(flyerDesign);
          const flyerFrame = await generateFlyer(
            storeName,
            mappedFlyerDesign,
            flyerCopy,
            brandContainer || mainContainer
          );
          // Store website URL for future QR code feature
          flyerFrame.setPluginData('websiteUrl', websiteUrl);
          generatedNodeIds.push(flyerFrame.id);
          processed++;
          updateProgress(processed, total);
        } catch (error) {
          const errorMsg = `Flyer for ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }

  // Select the generated container
  figma.currentPage.selection = [mainContainer];
  figma.viewport.scrollAndZoomIntoView([mainContainer]);

  figma.ui.postMessage({
    type: 'generation-complete',
    data: {
      total: processed,
      errors: errors.length > 0 ? errors : null,
      nodeIds: generatedNodeIds
    }
  });

  if (errors.length > 0) {
    figma.notify(`⚠️ Generated ${processed} items with ${errors.length} error(s). Check console for details.`, { error: true });
  } else {
    figma.notify(`✓ Successfully generated ${processed} materials!`);
  }
}

async function generatePoster(
  storeName: string,
  designChoice: string,
  processedCopy: string,
  container: FrameNode
): Promise<FrameNode> {
  // Load template from storage
  const templateKey = `poster_template_${designChoice}`;
  const template = await figma.clientStorage.getAsync(templateKey) as StoredTemplate;

  if (!template) {
    throw new Error(`Poster template "${designChoice}" not found. Please add this template first.`);
  }

  // Find and clone template frame
  const templateFrame = figma.getNodeById(template.id) as FrameNode;
  if (!templateFrame) {
    throw new Error(`Template frame "${template.name}" (${template.id}) no longer exists. Please re-add this template.`);
  }

  const clone = templateFrame.clone();
  clone.name = `${storeName} - Poster (${designChoice})`;

  // Replace text content
  await replaceTextInNode(clone, processedCopy, '{poster_copy}');

  // Add to container
  container.appendChild(clone);

  return clone;
}

async function generateFlyer(
  storeName: string,
  designChoice: string,
  processedCopy: string,
  container: FrameNode
): Promise<FrameNode> {
  // Load template from storage
  const templateKey = `flyer_template_${designChoice}`;
  const template = await figma.clientStorage.getAsync(templateKey) as StoredTemplate;

  if (!template) {
    throw new Error(`Flyer template "${designChoice}" not found. Please add this template first.`);
  }

  const templateFrame = figma.getNodeById(template.id) as FrameNode;
  if (!templateFrame) {
    throw new Error(`Template frame "${template.name}" (${template.id}) no longer exists. Please re-add this template.`);
  }

  const clone = templateFrame.clone();
  clone.name = `${storeName} - Flyer (${designChoice})`;

  // Replace text content
  await replaceTextInNode(clone, processedCopy, '{flyer_copy}');

  container.appendChild(clone);

  return clone;
}

async function replaceTextInNode(
  node: SceneNode,
  copyText: string,
  placeholder: string
) {
  const replaceInTextNode = async (textNode: TextNode) => {
    const originalText = textNode.characters;

    // Check if this text node contains the placeholder
    if (!originalText.includes(placeholder)) return;

    // Load all unique fonts in this text node
    const fontNames = new Set<string>();
    const len = textNode.characters.length;
    for (let i = 0; i < len; i++) {
      const fontName = textNode.getRangeFontName(i, i + 1) as FontName;
      fontNames.add(`${fontName.family}::${fontName.style}`);
    }

    // Load all fonts
    for (const fontKey of fontNames) {
      const [family, style] = fontKey.split('::');
      try {
        await figma.loadFontAsync({ family, style });
      } catch (error) {
        console.warn(`Could not load font ${family} ${style}:`, error);
      }
    }

    // Replace text
    const newText = originalText.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), copyText);
    textNode.characters = newText;
  };

  // Replace in all text nodes
  const processNode = async (n: SceneNode) => {
    if (n.type === 'TEXT') {
      await replaceInTextNode(n);
    }
    if ('children' in n) {
      for (const child of n.children) {
        await processNode(child);
      }
    }
  };

  await processNode(node);
}

function updateProgress(current: number, total: number) {
  figma.ui.postMessage({
    type: 'progress-update',
    data: { current, total, percentage: Math.round((current / total) * 100) }
  });
}

async function getStoredTemplates() {
  const keys = await figma.clientStorage.keysAsync();
  const posterKeys = keys.filter(k => k.startsWith('poster_template_'));
  const flyerKeys = keys.filter(k => k.startsWith('flyer_template_'));

  const posters = [];
  const flyers = [];

  for (const key of posterKeys) {
    const template = await figma.clientStorage.getAsync(key);
    posters.push({ ...template, key });
  }

  for (const key of flyerKeys) {
    const template = await figma.clientStorage.getAsync(key);
    flyers.push({ ...template, key });
  }

  figma.ui.postMessage({
    type: 'stored-templates',
    data: { posters, flyers }
  });
}

async function clearAllTemplates() {
  const keys = await figma.clientStorage.keysAsync();
  const templateKeys = keys.filter(k => k.startsWith('poster_template_') || k.startsWith('flyer_template_'));

  for (const key of templateKeys) {
    await figma.clientStorage.deleteAsync(key);
  }

  figma.ui.postMessage({
    type: 'templates-cleared'
  });

  figma.notify('All templates cleared');
}

// Helper function to convert Uint8Array to Base64 string
function arrayBufferToBase64(buffer: Uint8Array): string {
  const startTime = Date.now();
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
  console.log(`[EXPORT-PLUGIN] Starting Base64 encoding: ${sizeMB} MB`);

  const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  const len = buffer.length;

  while (i < len) {
    const a = buffer[i++];
    const b = i < len ? buffer[i++] : 0;
    const c = i < len ? buffer[i++] : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += base64chars.charAt((bitmap >> 18) & 63);
    result += base64chars.charAt((bitmap >> 12) & 63);
    result += i > len + 1 ? '=' : base64chars.charAt((bitmap >> 6) & 63);
    result += i > len ? '=' : base64chars.charAt(bitmap & 63);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const resultSizeMB = (result.length / 1024 / 1024).toFixed(2);
  console.log(`[EXPORT-PLUGIN] Base64 encoding complete: ${resultSizeMB} MB, took ${duration}s`);

  return result;
}

async function exportAsPNG(data: { nodeIds: string[] }) {
  const { nodeIds } = data;

  try {
    console.log(`[EXPORT-PLUGIN] ===== Starting export for ${nodeIds.length} nodes =====`);
    figma.notify('Exporting frames as PNG...');

    // Send total count first
    figma.ui.postMessage({
      type: 'export-started',
      data: {
        total: nodeIds.length
      }
    });

    // Export and send images one at a time to avoid freezing
    for (let i = 0; i < nodeIds.length; i++) {
      console.log(`[EXPORT-PLUGIN] ----- Processing node ${i + 1}/${nodeIds.length} -----`);

      const node = figma.getNodeById(nodeIds[i]);

      if (!node || (node.type !== 'FRAME' && node.type !== 'COMPONENT')) {
        console.warn(`[EXPORT-PLUGIN] Node ${nodeIds[i]} is not a valid frame or component`);
        continue;
      }

      console.log(`[EXPORT-PLUGIN] Node name: "${node.name}"`);

      // Update progress
      figma.ui.postMessage({
        type: 'export-progress',
        data: {
          current: i + 1,
          total: nodeIds.length,
          percentage: Math.round(((i + 1) / nodeIds.length) * 100)
        }
      });

      // Export as PNG
      const exportStart = Date.now();
      console.log(`[EXPORT-PLUGIN] Starting PNG export...`);

      const bytes = await (node as FrameNode).exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 3 } // 3x scale - frames at 100 DPI (1654×2339), export to 300 DPI (4962×7017)
      });

      const exportDuration = ((Date.now() - exportStart) / 1000).toFixed(2);
      const sizeMB = (bytes.length / 1024 / 1024).toFixed(2);
      console.log(`[EXPORT-PLUGIN] PNG export complete: ${sizeMB} MB, took ${exportDuration}s`);

      // Send raw bytes directly (no Base64 encoding needed!)
      console.log(`[EXPORT-PLUGIN] Sending message to UI...`);
      const messageSendStart = Date.now();

      figma.ui.postMessage({
        type: 'export-image',
        data: {
          name: node.name,
          bytes: bytes,
          index: i,
          total: nodeIds.length
        }
      });

      const messageSendDuration = ((Date.now() - messageSendStart) / 1000).toFixed(2);
      console.log(`[EXPORT-PLUGIN] Message sent, took ${messageSendDuration}s`);

      // Small delay to prevent UI freezing
      console.log(`[EXPORT-PLUGIN] Waiting 100ms before next iteration...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Signal completion
    console.log(`[EXPORT-PLUGIN] All nodes processed. Sending export-complete message...`);
    figma.ui.postMessage({
      type: 'export-complete',
      data: {
        total: nodeIds.length
      }
    });

    console.log(`[EXPORT-PLUGIN] ===== Export complete! =====`);
    figma.notify(`✓ Successfully exported ${nodeIds.length} PNG files!`);

  } catch (error) {
    console.error(`[EXPORT-PLUGIN] ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
    figma.ui.postMessage({
      type: 'error',
      message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    figma.notify('Export failed', { error: true });
  }
}
