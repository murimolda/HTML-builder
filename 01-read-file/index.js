const fs = require('fs');
const path = require('path');
const fileWay = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(fileWay, 'utf-8');
 
stream.on('readable', function(error, content){
  if(error){
    throw error;
  }
  content = stream.read();
  if(content !== null){
    console.log(content);
  }
});
 

// fs.ReadSream(fileWay, 'utf-8', (error, content) =>{
//   if(error){
//     throw error;
//   }
//   console.log(content);

// });

