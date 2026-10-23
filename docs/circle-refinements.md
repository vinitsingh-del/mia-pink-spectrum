# Coin and alignment refinement
- Preserve exact original coin photography with SVG contour clipping and transparent surroundings. Tight viewboxes fill the existing product circle; no photo regeneration or distortion.
- Centre Better Together bundle card titles/subtitles and section heading on both breakpoints.
- Centre Gifting Guide heading/subtitle on both breakpoints.
- New boutique and branded gift-card SVG illustrations using the existing Mia logo and pink/gold theme.
- Preserve hero, card container sizes and unrelated content.

## Verification
- Visually reviewed live desktop and mobile coins, bundle titles and Gifting Guide; desktop utility illustrations reviewed.
- Checked widths 320, 390, 430, 768, 1024 and 1440: no horizontal overflow, no clipped sections, no broken images; all targeted headings/titles centre-aligned.
- node --check app.js and git diff --check passed.
- Existing mobile visibility of the utility strip is preserved.
