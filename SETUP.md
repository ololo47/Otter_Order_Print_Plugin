# Plugin Setup - Quick Reference

## ✅ Build Status: COMPLETE

All required files are ready:
- ✓ `manifest.json` (222 bytes)
- ✓ `code.js` (14KB) - Compiled from code.ts
- ✓ `ui.html` (42KB) - Complete UI with PapaParse

## 🚀 Load Plugin in Figma (30 seconds)

### Step 1: Open Figma Desktop App
Make sure you're using the **Figma Desktop App**, not the browser version.

### Step 2: Import Plugin
1. Go to **Plugins** → **Development** → **Import plugin from manifest...**
2. Navigate to this folder: `/Users/osublee/Print_Automator_FigmaPlugIn`
3. Select **`manifest.json`**
4. Click **Open**

### Step 3: Run Plugin
1. In any Figma file, go to **Plugins** → **Development** → **Otter Order Material Generator**
2. The plugin UI will open!

## 🎯 First Test (3 minutes)

### 1. Create a Test Template
```
In Figma:
1. Create a frame (A for frame tool)
2. Press T for text, add: "Welcome to {brand_name}!"
3. Press T again, add: "{main_copy}"
4. Select the frame
5. Run the plugin
6. Click "Add Poster Template"
7. Enter "Design 1"
```

### 2. Create Test CSV
Save this as `test.csv` (UTF-8 encoding):
```csv
오터오더를 사용하려는 브랜드 이름,[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈),포스터에 들어갈 문구를 선택하세요.,[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈),전단지에 들어갈 문구를 선택하세요.,전단지에 삽입할 주문 건별 할인 예정 금액
김밥천국,Design 1,오터오더로 주문하고 할인받으세요!,Design 1,새로운 배달 경험,3000원
```

### 3. Generate
```
In plugin:
1. Go to Step 3, upload test.csv
2. Go to Step 4
3. Uncheck "Generate Flyers" (we only made a poster template)
4. Click "Generate All Materials"
5. See your generated poster!
```

## 🔧 Development Workflow

### Make Changes to Code
```bash
# Edit code.ts
# Then rebuild:
npm run build

# Or use watch mode:
npm run watch
```

### Reload Plugin in Figma
After rebuilding:
1. Right-click plugin in Figma menu
2. Select "Reload plugin"
3. Or close and reopen the plugin

## 📋 Required CSV Columns

Your CSV **must** have these exact Korean headers:

| Column | Korean Header |
|--------|---------------|
| Brand Name | `오터오더를 사용하려는 브랜드 이름` |
| Poster Design | `[포스터 1장 기본 제공] 선호하는 디자인을 골라주세요. (A2 사이즈)` |
| Poster Copy | `포스터에 들어갈 문구를 선택하세요.` |
| Flyer Design | `[전단지 300장 기본 제공] 선호하는 디자인을 선택하세요. (A5 사이즈)` |
| Flyer Copy | `전단지에 들어갈 문구를 선택하세요.` |
| Discount | `전단지에 삽입할 주문 건별 할인 예정 금액` |

## 🎨 Template Placeholders

Add these in text layers:
- `{brand_name}` - Required
- `{main_copy}` - Required
- `{discount_amount}` - Optional (flyers only)

## 🐛 Troubleshooting

### Plugin won't load
- Make sure you ran `npm install` and `npm run build`
- Verify `code.js` exists in the folder
- Use Figma Desktop App (not browser)

### "Template not found"
- Design names must match exactly (case-sensitive)
- CSV: "Design 1" → Template: "Design 1" ✓
- CSV: "Design 1" → Template: "design 1" ✗

### Korean text shows as boxes
- Install Korean fonts in Figma
- Use the fonts in your template
- Plugin will auto-load them

### CSV won't parse
- Save as UTF-8 encoding
- Use exact column headers above
- Check for special characters in data

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute tutorial
- **[README.md](README.md)** - Complete documentation
- **[docs/Dev_Plan.md](docs/Dev_Plan.md)** - Implementation plan

## ✅ You're Ready!

The plugin is compiled and ready to use in Figma.

**Next:** Open Figma Desktop App and import the plugin using the steps above.
