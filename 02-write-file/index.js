const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const textFile = path.join(__dirname, 'text.txt');

fs.writeFile(textFile, '', error =>{
  if(error){
    throw error;
  }
});

stdout.write('Write something!\n');
process.on('SIGINT', () => {
  console.log('Goodbye!');
  process.exit();
});

stdin.on('data', data =>{
  if(data.toString().trim() === '.exit'){
    console.log('Goodbye!');
    process.exit();
  }else{
    fs.appendFile(textFile, data, error =>{
      if(error){
        throw error;
      }
    });
  }

});
