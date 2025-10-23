# Quick Start Guide - Otter Order Material Generator

Get up and running in 5 minutes!

## Installation (One-time setup)

```bash
# 1. Install dependencies
npm install

# 2. Build the plugin
npm run build

# 3. Open Figma Desktop App
# 4. Go to: Plugins → Development → Import plugin from manifest...
# 5. Select the manifest.json file from this folder
```

## First Time Usage

### 1. Create Your First Template (2 minutes)

1. **In Figma, create a new frame:**
   - For poster: 420 × 594mm (A2 size)
   - For flyer: 148 × 210mm (A5 size)

2. **Add text layers with placeholders:**
   ```
   Welcome to {brand_name}!

   {main_copy}

   Get {discount_amount} off your first order!
   ```

3. **Run the plugin:**
   - Plugins → Development → Otter Order Material Generator

4. **Add your template:**
   - Select your frame
   - Click "Add Poster Template" (or "Add Flyer Template")
   - Enter "Design 1" as the name
   - Plugin confirms placeholders found ✓

### 2. Prepare Your CSV File (1 minute)

Create a CSV file with these columns (Korean headers):

```csv
오터오더를 사용하려는 브랜드 이름,[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈),포스터에 들어갈 문구를 선택하세요.,[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈),전단지에 들어갈 문구를 선택하세요.,전단지에 삽입할 주문 건별 할인 예정 금액
김밥천국,Design 1,오터오더로 주문하고 할인받으세요!,Design 1,새로운 배달 경험을 만나보세요,3000원
BBQ 치킨,Design 1,수수료 없는 자체 배달 플랫폼,Design 1,지금 주문하고 혜택 받으세요,5000원
```

**Important:** Save as UTF-8 encoding!

### 3. Generate Materials (30 seconds)

1. **In the plugin, go to Step 3:**
   - Click or drag your CSV file

2. **Go to Step 4:**
   - Keep all checkboxes checked
   - Click "🎨 Generate All Materials"

3. **Done!**
   - Materials appear on your canvas
   - Organized by brand name
   - Ready for export

## Example Template

Here's a simple poster template you can start with:

```
╔════════════════════════════════════════╗
║                                        ║
║        Welcome to {brand_name}!        ║
║                                        ║
║              오터오더 가맹점              ║
║                                        ║
║            {main_copy}                 ║
║                                        ║
║        QR Code Here                    ║
║                                        ║
║      Scan to order now!                ║
║                                        ║
╚════════════════════════════════════════╝
```

## Tips for Success

### ✅ DO:
- Save CSV as UTF-8 encoding
- Use exact design names from CSV in templates
- Include `{brand_name}` and `{main_copy}` placeholders
- Test with 1-2 rows first before processing large batches
- Use Korean fonts that are installed in Figma

### ❌ DON'T:
- Delete template frames after registering them
- Mix up design names (CSV says "Design 1" but template is "design 1")
- Forget to build (`npm run build`) after editing code.ts

## Common First-Time Issues

### "Template not found"
**Solution:** Design names must match exactly!
- CSV says: "Design 1"
- Template must be: "Design 1" (not "design 1" or "Design1")

### Korean text shows as boxes
**Solution:**
1. Install Korean fonts in Figma
2. Use the fonts in your template
3. The plugin will auto-load them

### CSV won't parse
**Solution:**
1. Check file encoding is UTF-8
2. Open in Excel/Numbers → Save As → CSV UTF-8
3. Or use Google Sheets → Download → CSV

## Next Steps

Once you've generated your first batch:

1. **Export for printing:**
   - See [docs/A2_PDF_Conversion_Guide.md](docs/A2_PDF_Conversion_Guide.md)

2. **Create more templates:**
   - Design 2, Design 3, etc.
   - Different styles for different seasons

3. **Set up copy mappings:**
   - Step 2 in the plugin
   - Standardize marketing messages

## Need Help?

1. Check [README.md](README.md) for detailed documentation
2. Look at [docs/Dev_Plan.md](docs/Dev_Plan.md) for technical details
3. Open Figma Console: Plugins → Development → Open Console

---

**You're ready to automate!** 🚀

Generate your first batch of materials and save hours of manual work.
