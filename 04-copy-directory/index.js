const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const srcFolder = path.join(__dirname, 'files');
  const destFolder = path.join(__dirname, 'files-copy');

  await fs.rm(destFolder, { recursive: true, force: true });
  await fs.mkdir(destFolder, { recursive: true });
  await copyRecursively(srcFolder, destFolder);
  console.log('Папка "files-copy" успешно обновлена!');
}

async function copyRecursively(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyRecursively(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
copyDir();
