const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
  if(err) console.error(err.message);

  files.forEach(file => {
    fs.stat(path.join(secretFolder, file), (err, stats) => {
      if (err) console.error(err.message);

      if (stats?.isFile()) {
        const fileName = file.split('.')[0];
        const extName = path.extname(file).split('.')[1];
        const size = (stats.size * 0.001) + 'kb';
        console.log(`${fileName} - ${extName} - ${size}`);
      }
    });
  });

});