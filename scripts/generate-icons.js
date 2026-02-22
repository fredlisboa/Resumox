const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'brain-icon.svg');

async function generateIcons() {
  console.log('🧠 Generating NeuroReset app icons...\n');

  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate icon-192x192.png
    console.log('📱 Generating icon-192x192.png...');
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192x192.png'));

    // Generate icon-512x512.png
    console.log('📱 Generating icon-512x512.png...');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512x512.png'));

    // Generate apple-touch-icon.png (180x180 for iOS)
    console.log('🍎 Generating apple-touch-icon.png...');
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Generate favicon-32x32.png
    console.log('🌐 Generating favicon-32x32.png...');
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Generate favicon-16x16.png
    console.log('🌐 Generating favicon-16x16.png...');
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    console.log('\n✅ All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  ✓ icon-192x192.png (192x192)');
    console.log('  ✓ icon-512x512.png (512x512)');
    console.log('  ✓ apple-touch-icon.png (180x180)');
    console.log('  ✓ favicon-32x32.png (32x32)');
    console.log('  ✓ favicon-16x16.png (16x16)');
    console.log('\n💡 Tip: Use favicon-32x32.png as favicon.ico or convert it online');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
