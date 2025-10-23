# Otter Order Material Generator - Figma Plugin

A Figma plugin to automate the generation of customized Korean marketing materials (A2 posters and A5 flyers) for Otter Order restaurant signups.

## Features

- **CSV Import**: Parse UTF-8 encoded Korean CSV files with customer signup data
- **Template Management**: Select and store Figma frames as reusable templates
- **Dynamic Text Replacement**: Automatically replace placeholders with customer data
  - `{brand_name}` - Restaurant brand name
  - `{main_copy}` - Marketing copy text
  - `{discount_amount}` - Discount amount (flyers only)
- **Batch Generation**: Generate materials for multiple customers at once
- **Progress Tracking**: Real-time progress bar during generation
- **Copy Mapping**: Map CSV copy choices to actual marketing text
- **Organized Output**: Group materials by brand name

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Plugin

```bash
npm run build
```

This will compile `code.ts` to `code.js`.

### 3. Load in Figma

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from this directory
4. The plugin will appear in your **Plugins** → **Development** menu

## Development

### Watch Mode

For development, run TypeScript in watch mode:

```bash
npm run watch
```

This will automatically recompile `code.ts` whenever you make changes.

### File Structure

```
Print_Automator_FigmaPlugIn/
├── manifest.json       # Plugin configuration
├── code.ts            # Main plugin logic (TypeScript)
├── code.js            # Compiled plugin code (generated)
├── ui.html            # Plugin UI with embedded CSS/JS
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── docs/              # Documentation
└── README.md          # This file
```

## Usage Guide

### Step 1: Template Setup

1. **Create Template Frames** in Figma:
   - Design your poster (A2: 420 × 594mm)
   - Design your flyer (A5: 148 × 210mm)

2. **Add Text Placeholders**:
   - Add text layers with these exact placeholders:
     - `{brand_name}` - Will be replaced with restaurant name
     - `{main_copy}` - Will be replaced with marketing copy
     - `{discount_amount}` - Will be replaced with discount (flyers only)

3. **Register Templates**:
   - Select a template frame
   - Click "Add Poster Template" or "Add Flyer Template"
   - Enter a design name (e.g., "Design 1", "Design 2")
   - The plugin will validate placeholders

### Step 2: Copy Options Mapping (Optional)

Map CSV copy choices to actual marketing text:
- Click "Add Copy Option" to create manual mappings
- Or click "Load Otter Defaults" to use preset Korean copy options

### Step 3: Import CSV File

1. **Prepare CSV File**:
   - Must be UTF-8 encoded
   - Required columns (Korean headers):
     - `오터오더를 사용하려는 브랜드 이름` (Brand name)
     - `[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)` (Poster design)
     - `포스터에 들어갈 문구를 선택하세요.` (Poster copy)
     - `[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)` (Flyer design)
     - `전단지에 들어갈 문구를 선택하세요.` (Flyer copy)
     - `전단지에 삽입할 주문 건별 할인 예정 금액` (Discount amount)

2. **Upload CSV**:
   - Drag and drop CSV file, or click to browse
   - Preview will show first 5 rows

### Step 4: Generate Materials

1. **Select Options**:
   - ☑️ Generate Posters (A2)
   - ☑️ Generate Flyers (A5)
   - ☑️ Group materials by brand name

2. **Click "Generate All Materials"**:
   - Watch the progress bar
   - Generated materials will appear on your Figma canvas
   - Materials are organized in a timestamped container frame

## CSV Column Reference

| Korean Column Header | Purpose | Example |
|---------------------|---------|---------|
| 오터오더를 사용하려는 브랜드 이름 | Brand name | "김밥천국", "BBQ 치킨" |
| [포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈) | Poster design choice | "Design 1", "Design 2" |
| 포스터에 들어갈 문구를 선택하세요. | Poster marketing copy | "오터오더로 주문하고 할인받으세요!" |
| [전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈) | Flyer design choice | "Design 1", "Design 2" |
| 전단지에 들어갈 문구를 선택하세요. | Flyer marketing copy | "새로운 배달 경험을 만나보세요" |
| 전단지에 삽입할 주문 건별 할인 예정 금액 | Discount amount | "3,000원", "5,000원" |

## Troubleshooting

### "Template not found" error
- Make sure you've added templates with the exact design names used in your CSV
- Example: If CSV says "Design 1", your template must be registered as "Design 1"

### Korean text not displaying correctly
- Ensure your CSV is UTF-8 encoded
- Check that Korean fonts are installed in Figma
- The plugin will attempt to load existing fonts from your templates

### Missing placeholders warning
- Templates must contain at least `{brand_name}` and `{main_copy}` placeholders
- Add these as text layers in your template frames

### "Frame no longer exists" error
- Re-add the template if you've deleted or renamed the original frame
- Use "Validate Templates" button to check all templates

## Export for Print

After generation, export your materials:

1. Select the generated frames
2. Right-click → **Export**
3. For **A2 Posters**: Export at 4984 × 7041px (300 DPI with bleed)
4. For **A5 Flyers**: Export at 1754 × 2480px (300 DPI with bleed)
5. Export as PDF or PNG depending on printer requirements

See [docs/A2_PDF_Conversion_Guide.md](docs/A2_PDF_Conversion_Guide.md) for detailed print specifications.

## Technical Details

- **Built with**: TypeScript, Figma Plugin API
- **CSV Parsing**: PapaParse v5.4.1 (embedded)
- **Encoding**: UTF-8 for Korean language support
- **Storage**: Figma Client Storage API for template persistence
- **Font Loading**: Asynchronous font loading for multi-style text

## Development Roadmap

### Phase 1 (Current): MVP
- ✅ Korean CSV import
- ✅ Template management
- ✅ Basic text replacement
- ✅ Batch generation
- ✅ Progress tracking

### Phase 2 (Planned):
- [ ] PDF export with print specifications
- [ ] Advanced copy mapping UI
- [ ] Template preview system
- [ ] Export presets for different printers

### Phase 3 (Future):
- [ ] Image placeholder support
- [ ] QR code generation
- [ ] Delivery address integration
- [ ] Print manifest generation

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the usage guide
3. Check Figma's developer console for errors (Plugins → Development → Open Console)

## License

MIT

---

**Built for Otter Order** - Automating Korean restaurant marketing materials
