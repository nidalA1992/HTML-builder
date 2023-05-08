const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const BUNDLE_FILE = 'bundle.css';

const stylesFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');

const emitter = new EventEmitter();

deleteBundleCss();

emitter.on('deleted', () => {
  readStyles(stylesFolder);
});

emitter.on('read', (files) => {
  copyFiles(files);
});

function deleteBundleCss() {
  fs.rm(path.join(distFolder, BUNDLE_FILE), () => {
    emitter.emit('deleted');
  });
}

function readStyles(path) {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err.message);
  
    emitter.emit('read', files);
  });
}

function copyFiles(files) {
  files.forEach((file, i) => {
    fs.stat(path.join(stylesFolder, file), (err, stats) => {
      if(err) console.error(err.message);

      if (stats.isFile() && path.extname(file) === '.css') {
        const readStream = fs.createReadStream(path.join(stylesFolder, file), 'utf-8');
        
        let data = '';

        readStream.on('data', (chunk) => {
          data += chunk;
        });

        readStream.on('end', () => {
          data += '\n';

          fs.appendFile(path.join(distFolder, BUNDLE_FILE), data, (err) => {
            if (err) console.error(err.message);
          });
        });
      } 
    });
  });
}