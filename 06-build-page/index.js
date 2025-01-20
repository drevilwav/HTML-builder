const fs = require('fs/promises');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

async function buildPage() {
  await fs.mkdir(distDir, { recursive: true });

  const template = await fs.readFile(templateFile, 'utf-8');
  const filledTemplate = await fillTemplate(template);
  await fs.writeFile(path.join(distDir, 'index.html'), filledTemplate);

  const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });
  const cssContents = [];
  for (const item of styleFiles) {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(stylesDir, item.name);
      const data = await fs.readFile(filePath, 'utf-8');
      cssContents.push(data);
    }
  }
  await fs.writeFile(path.join(distDir, 'style.css'), cssContents.join('\n'));

  const distAssetsDir = path.join(distDir, 'assets');
  await copyAssets(assetsDir, distAssetsDir);

  console.log('Сборка страницы завершена!');
}

async function fillTemplate(template) {
  let result = template;
  const tagPattern = /\{\{(\w+)\}\}/g;
  let match;

  while ((match = tagPattern.exec(result)) !== null) {
    const tagName = match[1];
    const componentPath = path.join(componentsDir, `${tagName}.html`);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    result = result.replace(match[0], componentContent);
  }
  return result;
}

async function copyAssets(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
