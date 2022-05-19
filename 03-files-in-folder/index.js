const path = require('path');
const fs = require('fs');

const secretFolder = path.resolve(path.dirname(__filename), './secret-folder');

fs.readdir(secretFolder, (error, files) => {
  if(error){
    throw error;
  }

  for (let i = 0; i < files.length; i++) {
    fs.stat(path.resolve(secretFolder, files[i]), (error, stats) => {
      if(error){
        throw error;
      }
      if (stats.isFile()) {
        let fileBaseName = path.basename(path.resolve(secretFolder, files[i]));
        let fileName = fileBaseName.substring(0, fileBaseName.indexOf('.'));
        let fileBaseEnd = path.extname(path.resolve(secretFolder, files[i]));
        let fileEnd = fileBaseEnd.substring(fileBaseEnd.indexOf('.') + 1, fileBaseEnd.length);
        let fileSize = (stats.size / 1024).toFixed(3);
        console.log(`${fileName} - ${fileEnd} - ${fileSize}kb`);
      }
    });
  }
});

