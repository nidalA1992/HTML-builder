const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const { 
  copyStyles, 
  recursiveCopy, 
  attachComponents, 
  getComponents 
} = require('./lib/utils');

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
