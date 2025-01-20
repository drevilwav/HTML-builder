const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundle = path.join(distDir, 'bundle.css');

async function mergeStyles() {
  await fs.mkdir(distDir, { recursive: true });

  const items = await fs.readdir(stylesDir, { withFileTypes: true });
  const cssContents = [];

  for (const item of items) {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(stylesDir, item.name);
      const data = await fs.readFile(filePath, 'utf-8');
      cssContents.push(data);
    }
  }

  await fs.writeFile(bundle, cssContents.join('\n'));
  console.log('Файл bundle.css создан!');
}

mergeStyles();
