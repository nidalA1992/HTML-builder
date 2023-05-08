const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const emit = new EventEmitter();

const assets = path.join(__dirname, 'assets');
const styles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');

const dist = path.join(__dirname, 'project-dist');

fs.rm(dist, { recursive: true }, (err) => {
  if (err) {
    emit.emit('deleted');
    return;
  }
  emit.emit('deleted');
});

emit.on('deleted', () => {
  fs.mkdir(path.join(dist), (err) => {
    if(err) console.error(err.message);

    fs.mkdir(path.join(dist, 'assets'), (err) => {
      if(err) console.error(err.message);
      emit.emit('created'); 
    });
  });
});

emit.on('created', () => {
  recursiveCopy(path.join(dist, 'assets'), assets);
  copyStyles(dist, styles);
  getComponents(components, emit);
});

emit.on('components-done', (components) => {
  attachComponents(dist, template, components);
});

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