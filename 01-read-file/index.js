const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

class Reader {
  constructor(path) {
    this.path = path;
  }

  concatChunk(chunk) {
    if(!this.data) {
      this.data = chunk;
    } else {
      this.data += chunk;
    }
  }

  onEnd() {
    console.log(this.data);
  }

  onError(error) {
    console.error(new Error(error.message));
  }

  createStream() {
    this.stream = fs.createReadStream(this.path, 'utf-8');
  }

  initHandlers() {
    this.stream.on('data', this.concatChunk);
    this.stream.on('end', this.onEnd);
    this.stream.on('error', this.onError);
  }

  read() {
    this.createStream();
    this.initHandlers();
  }
}

new Reader(filePath).read();