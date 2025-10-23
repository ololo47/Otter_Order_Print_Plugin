Phase 1: MVP - Korean Market Focus (Week 1)
markdownCreate a Figma plugin for Otter Order poster/flyer generation:

## Core Requirements:
1. Support Korean language throughout the UI
2. Import the Otter Signup CSV (UTF-8 encoding)
3. Two template types:
   - A2 Poster Templates (420 × 594mm)
   - A5 Flyer Templates (148 × 210mm)
4. Generate posters/flyers with customer-specific text

## CSV Columns to Process:
- Brand Name: Column "오터오더를 사용하려는 브랜드 이름"
- Poster Design: Column "[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)"
- Poster Copy: Column "포스터에 들어갈 문구를 선택하세요."
- Flyer Design: Column "[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)"
- Flyer Copy: Column "전단지에 들어갈 문구를 선택하세요."
- Discount Amount: Column "전단지에 삽입할 주문 건별 할인 예정 금액"

## Template Structure:
Each template should have these text replacement zones:
- {brand_name} - The restaurant/brand name
- {main_copy} - Selected marketing copy
- {discount_amount} - For flyers only

## Simple Implementation:
- Parse CSV with proper UTF-8 handling
- Map design choices to pre-made Figma frames
- Replace text placeholders
- Export as PNG initially
- Show Korean labels in UI
Phase 2: Design Preset Mapping (Week 2)
markdown## Design Choice Mapping System

Since the CSV contains design choices (likely as "Design 1", "Design 2" etc.):

1. Create a mapping system:
   - Map poster design choices to specific Figma frames
   - Map flyer design choices to specific Figma frames
   
2. Template Library Structure:
   PosterTemplates/
   ├── Design_1_A2/
   ├── Design_2_A2/
   └── Design_3_A2/
   
   FlyerTemplates/
   ├── Design_1_A5/
   ├── Design_2_A5/
   └── Design_3_A5/

3. Copy Options Mapping:
   - Map standard copy choices to actual text
   - Handle custom copy input
   - Support discount amount insertion

4. Batch Processing:
   - Generate both poster AND flyer for each customer
   - Name files with brand name + type
   - Group by customer
Phase 3: Production-Ready Export (Week 3)
markdown## Print-Ready Output

1. Export specifications:
   - A2 Posters: 4984 × 7041 pixels at 300 DPI (with bleed)
   - A5 Flyers: 1754 × 2480 pixels at 300 DPI (with bleed)
   
2. File naming convention:
   - {brand_name}_poster_A2.pdf
   - {brand_name}_flyer_A5.pdf
   
3. Batch export features:
   - Generate print package per customer
   - Include delivery address in metadata/filename
   - Create manifest file with all generated items
Simplified Phase 1 Prompt for Immediate Start:
markdownCreate a Figma plugin that processes the Otter Order signup CSV to generate marketing materials.

## Immediate Requirements:

1. CSV Import:
   - Parse UTF-8 encoded Korean CSV
   - Extract these specific columns:
     * "오터오더를 사용하려는 브랜드 이름" (brand name)
     * "[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)" (poster design)
     * "포스터에 들어갈 문구를 선택하세요." (poster copy)
     * "[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)" (flyer design)
     * "전단지에 들어갈 문구를 선택하세요." (flyer copy)
     * "전단지에 삽입할 주문 건별 할인 예정 금액" (discount amount)

2. Template Setup:
   - Allow designer to mark frames as poster/flyer templates
   - Use naming convention: "Poster_Design_1", "Flyer_Design_1", etc.
   - Mark text layers with {brand_name}, {copy}, {discount} placeholders

3. Generation Logic:
   - For each CSV row:
     * Find matching poster template based on design choice
     * Replace placeholders with actual data
     * Clone and generate poster
     * Repeat for flyer
     * Group results by brand name

4. Simple UI:
   - File input for CSV
   - Preview of parsed data
   - Generate button
   - Progress indicator
   - Export as PNG for now

5. Korean Language Support:
   - UI labels in Korean
   - Proper UTF-8 handling
   - Korean font support validation

Focus: Get working prototype that can process the actual Otter CSV and generate customized materials. Don't worry about PDF export yet.
Data Mapping Strategy:
Based on your CSV, here's how the data flows:
javascript// Example mapping from CSV to design
const processOtterSignup = (csvRow) => {
  return {
    // Customer identification
    brandName: csvRow["오터오더를 사용하려는 브랜드 이름"],
    email: csvRow["이메일"],
    
    // Poster specifications
    poster: {
      template: csvRow["[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)"],
      copy: csvRow["포스터에 들어갈 문구를 선택하세요."],
      size: "A2"
    },
    
    // Flyer specifications
    flyer: {
      template: csvRow["[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)"],
      copy: csvRow["전단지에 들어갈 문구를 선택하세요."],
      discount: csvRow["전단지에 삽입할 주문 건별 할인 예정 금액"],
      size: "A5",
      quantity: 300
    },
    
    // Delivery
    address: csvRow["포스터와 전단지를 받으실 주소를 알려주세요."]
  };
};