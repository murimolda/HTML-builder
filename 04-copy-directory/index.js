const fs = require('fs');
const path = require('path');

const originFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyFiles(folder, copy) {
  await fs.promises.mkdir(copy, { recursive: true });
  let files = await fs.promises.readdir(folder, { withFileTypes: true });
  for (let item of files) {
    if (item.isDirectory()) {
      await copyFiles(path.join(folder, item.name), path.join(copy, item.name));
    } else {
      await fs.promises.copyFile(path.join(folder, item.name), path.join(copy, item.name));
    }
  }
}

function changeFolder(folder, copy) {
  fs.rm(copy, { recursive: true, force: true }, () => copyFiles(folder, copy));
}

changeFolder(originFolder, copyFolder);