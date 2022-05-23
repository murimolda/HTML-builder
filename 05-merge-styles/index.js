const fs = require('fs');
const path = require('path');

const bundleStyles = path.join(__dirname, 'project-dist', 'bundle.css');
const originStyles = path.join(__dirname, 'styles');

async function createBundle() {
  try {
    await fs.promises.writeFile(bundleStyles, '');  
    let files = await fs.promises.readdir(originStyles, {withFileTypes: true });
    for (let item of files) {
      let fileType = path.parse(path.join(originStyles, item.name));
      if (item.isFile() && fileType.ext === '.css') {
        let data = '';
        let readStream = fs.createReadStream(path.join(originStyles, item.name), 'utf-8');
        readStream.on('data', (chunk) => (data += chunk));
        readStream.on('end', () =>
          fs.promises.appendFile(bundleStyles, data)
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

createBundle();