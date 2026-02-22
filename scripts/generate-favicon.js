const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  console.log('🌐 Generating favicon.ico...\n');

  try {
    // Read the PNG files
    const files = [
      fs.readFileSync(path.join(publicDir, 'favicon-16x16.png')),
      fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'))
    ];

    // Convert to ICO
    const ico = await toIco(files);

    // Write the ICO file
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

    console.log('✅ favicon.ico generated successfully!');

  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error);
    process.exit(1);
  }
}

generateFavicon();
