const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const resumoxDir = path.join(publicDir, 'resumox');
const svgPath = path.join(resumoxDir, 'icon.svg');

async function generateIcons() {
  console.log('Generating ResumoX app icons...\n');

  try {
    const svgBuffer = fs.readFileSync(svgPath);

    // PWA icons
    const sizes = [
      { name: 'icon-192x192.png', size: 192 },
      { name: 'icon-512x512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'favicon-16x16.png', size: 16 },
    ];

    for (const { name, size } of sizes) {
      console.log(`Generating ${name} (${size}x${size})...`);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(resumoxDir, name));
    }

    console.log('\nAll ResumoX icons generated successfully!');
    console.log('\nGenerated files:');
    sizes.forEach(({ name, size }) => {
      console.log(`  ${name} (${size}x${size})`);
    });

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
