const fs = require('fs/promises');
const path = require('path');

(async () => {
  const folderPath = path.join(__dirname, 'secret-folder');

  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (const item of files) {
    if (item.isFile()) {
      const fullPath = path.join(folderPath, item.name);
      const stats = await fs.stat(fullPath);
      const extension = path.extname(item.name).slice(1);
      const fileName = path.basename(item.name, path.extname(item.name));
      console.log(
        `${fileName} - ${extension} - ${(stats.size / 1024).toFixed(3)}kb`,
      );
    }
  }
})();
