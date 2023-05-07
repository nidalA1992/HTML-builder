const path = require('path');
const Reader = require('./Reader');

const filePath = path.join(__dirname, 'text.txt');

new Reader(filePath).read();
