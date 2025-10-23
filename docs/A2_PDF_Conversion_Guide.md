# A2 PDF Conversion Guide - Successful Method

## Overview
This guide documents the successful conversion of figma4.png to A2 PDF format matching printing company specifications.

## Requirements
- macOS
- Homebrew package manager
- ImageMagick

## Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, add to PATH:
```bash
echo >> ~/.zprofile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Step 2: Install ImageMagick

```bash
brew install imagemagick
```

Verify installation:
```bash
/opt/homebrew/bin/magick --version
```

## Step 3: Analyze Sample PDF Specifications

The printing company's sample PDF had these specifications:
- **Page size:** 42.2 × 59.61 cm
- **Pixel dimensions at 300 DPI:** 4984 × 7041 pixels
- **Format:** PDF 1.4+
- **Color mode:** RGB
- **Includes:** Bleed area for professional printing

## Step 4: Convert PNG to A2 PDF

Navigate to your Downloads folder and run:

```bash
cd ~/Downloads
/opt/homebrew/bin/magick figma4.png \
  -density 300 \
  -background white \
  -gravity center \
  -extent 4984x7041 \
  -units PixelsPerInch \
  figma4_A2_Final.pdf
```

### Command Breakdown:
- `figma4.png` - Source image file
- `-density 300` - Set resolution to 300 DPI (print quality)
- `-background white` - Use white background for any empty areas
- `-gravity center` - Center the image on the canvas
- `-extent 4984x7041` - Set exact pixel dimensions (42.2 × 59.61 cm at 300 DPI)
- `-units PixelsPerInch` - Specify DPI units
- `figma4_A2_Final.pdf` - Output filename

## Step 5: Verify the Output

Check the file was created:
```bash
ls -lh ~/Downloads/figma4_A2_Final.pdf
```

Open in Preview to verify dimensions:
```bash
open ~/Downloads/figma4_A2_Final.pdf
```

In Preview, go to **Tools > Show Inspector** to verify:
- Page size: 42.2 × 59.61 cm
- Resolution: 300 DPI

## Final Output Specifications

- **File:** figma4_A2_Final.pdf
- **Size:** ~14 MB
- **Dimensions:** 42.2 × 59.61 cm (4984 × 7041 pixels)
- **Resolution:** 300 DPI
- **Format:** PDF document
- **Ready for:** Professional A2 poster printing

## Notes

- The dimensions (42.2 × 59.61 cm) are slightly larger than standard A2 (42.0 × 59.4 cm) to include bleed area
- 300 DPI is the industry standard for high-quality printing
- White background ensures clean edges if image doesn't fill entire canvas
- Centered gravity ensures design is properly positioned

## Troubleshooting

If ImageMagick commands fail:
1. Ensure Homebrew path is added: `eval "$(/opt/homebrew/bin/brew shellenv)"`
2. Use full path to magick: `/opt/homebrew/bin/magick`
3. Verify ImageMagick is installed: `brew list imagemagick`

---
Created: October 21, 2025
Status: Verified and tested successfully
