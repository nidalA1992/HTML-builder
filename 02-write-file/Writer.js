const fs = require('fs');
const path = require('path');
const process = require('node:process');
const readline = require('node:readline');

class Writer {
  onExit () {
    console.log('Сообщение сохранено! Пока!');
    process.exit();
  }

  init(fileName) {
    const pathName = path.join(__dirname, fileName);
    const stream = fs.createWriteStream(pathName, 'utf-8');
    const {stdin: input, stdout: output} = process;

    console.log('Введите сообщение:');

    const read = readline.createInterface({ input, output });

    read.on('line', (input) => {
      if (input === 'exit') this.onExit();

      stream.write(input + '\n');
    });

    read.on('close', this.onExit);
  }
}

module.exports = Writer;