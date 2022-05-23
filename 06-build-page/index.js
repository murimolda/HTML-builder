const path = require('path');
const fs = require('fs');

async function createFolder(folder) {
  fs.mkdir(folder, {recursive: true}, error => {
    if (error){
      console.error(error.message);
    } 
  });
}
createFolder(path.join(__dirname, 'project-dist'));

const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const originFolder = path.join(__dirname, 'assets');
const copyFolder = path.join(__dirname, 'project-dist', 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

let data = '';

async function getHtmlComponents(components) {
  return new Promise ((resolve, reject) => {
    let readStream = fs.createReadStream(path.join(__dirname, 'components', `${components}.html`));
    let data = '';
    readStream.on('data', chunk => data += chunk);
    readStream.on('error', error => reject(error.message));
    readStream.on('end', () => resolve(data));
  });
}

async function findTemplate() {
  let templetes = data.match(/{{.*}}/g);
  templetes.forEach(item => {
    getHtmlComponents(item.replace(/[{}]/g, '')).then(text => {
      data = data.replace(item, text);
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data, error => {
        if (error){
          console.error(error.message);
        }
      }); 
    }).catch(error => console.error(error.message)); 
  });
}

readStream.on('data', chunk => data += chunk);
readStream.on('end', findTemplate);
readStream.on('error', error => console.error(error.message));

async function copyFiles(origin, copy) {
  fs.copyFile(origin, copy, error => {
    if (error){
      console.error(error.message);
    }
  });
}

async function copyDirectory(origin, copy) {
  createFolder(copy);
  fs.readdir(origin, (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => {
      fs.stat(path.join(origin, file), (error, stats) => {
        if (error){
          console.error(error.message);
        }
        if (stats.isFile()) {
          copyFiles(path.join(origin, file), path.join(copy, file));
        } else if (stats.isDirectory()) {
          copyDirectory(path.join(origin, file), path.join(copy, file));
        }
      });   
    });
  });
}

fs.access(copyFolder, error => {
  if (error) copyDirectory(originFolder, copyFolder);
  else {
    fs.rm(copyFolder, {recursive: true}, error => {
      if (error){
        console.error(error.message);
      }
      copyDirectory(originFolder, copyFolder);
    });
  }
});

fs.readdir(stylesFolder, (error, files) => {
  if (files.indexOf('footer.css') > -1) {
    files.push(files.splice(files.indexOf('footer.css'), 1)[0]);
  }
  files.forEach(file => {
    if (error){
      console.error(error.message);
    }
    let fileWay = path.join(stylesFolder, file);
    fs.stat(fileWay, (error, stats) => {
      if (error) return console.error(error.message);
      if (stats.isFile() && path.extname(fileWay) === '.css') {
        let readStream = fs.createReadStream(fileWay, 'utf-8');
        readStream.pipe(writeStream);
      }
    });
  });
});

