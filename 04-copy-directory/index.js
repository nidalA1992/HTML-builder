const fs = require('fs');
const path = require('path');

const destDirPath = path.join(__dirname, 'files-copy');
const sourceDirPath = path.join(__dirname, 'files');

fs.rm(destDirPath, { recursive: true}, () => {
  fs.mkdir(
    destDirPath,
    {recursive: true},
    (err) => {
      if (err) console.error(err.message);

      fs.readdir(sourceDirPath, (err, files) => {
        if (err) console.error(err.message);

        files.forEach(file => {
          fs.copyFile(
            path.join(sourceDirPath, file),
            path.join(destDirPath, file),
            (err) => {
              if (err) console.error(err.message);
            }
          );
        });
      });
    }
  );
});






