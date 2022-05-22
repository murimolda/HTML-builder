const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const originFolder = path.resolve(path.dirname(__filename), './files');
const copyFolder = path.resolve(path.dirname(__filename), './files-copy');

fs.stat(copyFolder, function(error) {
  if (!error) {
    deleteFiles(copyFolder);
    copyFiles(originFolder, copyFolder);
  }
  else if (error.code === 'ENOENT') {
    fs.mkdir(copyFolder, error => {
      if(error) throw error;
      copyFiles(originFolder, copyFolder);
    });
  }
});

const copyFiles = (folder, copy) =>{
  fs.readdir(folder, (error, files) => {
    if(error) throw error;
    for (let i = 0; i < files.length; i++) {
      fs.stat(path.resolve(folder, files[i]), (error, stats) => {
        if(error){
          throw error;
        }
        if (stats.isFile()) {
          fs.copyFile(path.normalize(path.resolve(folder, files[i])), path.normalize(path.resolve(copy, files[i])), error => {
            if(error) throw error;
          });
        }else if(stats.isDirectory()){
          fs.mkdir(path.resolve(copy, files[i]), error => {
            if(error) throw error;
            copyFiles(path.resolve(folder, files[i]), path.resolve(copy, files[i]));
          });
        }
      });
    }
  });
};

const deleteFiles = (folder) =>{
  fs.readdir(folder, (error, files) => {
    if(error) throw error;
    for (let i = 0; i < files.length; i++) {
      fs.stat(path.resolve(folder, files[i]), (error, stats) => {
        if(error){
          throw error;
        }
        if (stats.isFile()) {
          fs.unlink(path.resolve(folder, files[i]), error => {
            if(error) throw error;
          });
        }else {
          deleteFiles(path.resolve(folder, files[i]));
          removeDirectory(path.resolve(folder, files[i]));
        }
      });
    }
  });
};

const removeDirectory = async (dirPath) => {
  try {
    await fsPromises.rm(dirPath, { recursive: true });
  } catch (error) {
    console.log(error);
  }
};


