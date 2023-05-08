const fs = require('fs');
const path = require('path');

function copyStyles(dist, source) {
  fs.readdir(source, { withFileTypes: true }, (err, data) => {
    if (err) console.error(err.message);

    data.forEach(item => {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const stream = fs.createReadStream(path.join(source, item.name));

        let data = '';

        stream.on('data', (chunk) => {
          data += chunk;
        });

        stream.on('end', () => {
          data += '\n';

          fs.appendFile(path.join(dist, 'style.css'), data, (err) => {
            if (err) console.error(err.message);
          });
        });
      }
    });
  });
}

function recursiveCopy(dist, source) {
  fs.readdir(source, { withFileTypes: true }, (err, data) => {
    if (err) console.error(err.message);

    data.forEach(item => {
      if (item.isFile()) {

        fs.copyFile(path.join(source, item.name), path.join(dist, item.name), (err) => {
          if (err) console.error(err.message);
        });

      } else {

        fs.mkdir(path.join(dist, item.name), (err) => {
          if (err) console.error(err.message);
        });

        recursiveCopy(path.join(dist, item.name), path.join(source, item.name));
      }
    });
  });
}

function attachComponents(dist, template, components) {

  let doc = '';

  const input = fs.createReadStream(template);
  const output = fs.createWriteStream(path.join(dist, 'index.html'));

  input.on('data', (chunk) => {
    doc += chunk;
  });

  input.on('end', () => {
    
    for(const [name, component] of Object.entries(components)) {
      const target = `{{${name}}}`;

      doc = doc.replaceAll(target, component);
    }

    output.write(doc);
  });
}

function getComponents(source, emit) {
  fs.readdir(source, (err, data) => {
    if (err) console.error(err.message);

    let comp = {};

    const components = data.filter(item => path.extname(item) === '.html');

    components.forEach((component, i) => {
      const rs = fs.createReadStream(path.join(source, component));

      const name = component.split('.')[0];

      comp[name] = '';

      rs.on('data', (chunk) => {
        if (err) console.error(err.message);

        comp[name] += chunk;
      });

      rs.on('end', () => {

        if (i === components.length - 2) {
          emit.emit('components-done', comp);
        }
      });
    });
  });
}

module.exports = {
  copyStyles,
  recursiveCopy,
  attachComponents,
  getComponents
};