const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log(
  'Введите текст, который нужно записать в файл (введите "exit" для выхода):',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    goodbye();
  } else {
    writableStream.write(`${input}\n`);
    console.log('Текст записан! Введите следующий:');
  }
});

rl.on('SIGINT', () => {
  goodbye();
});

process.on('SIGINT', () => {
  goodbye();
});

function goodbye() {
  console.log('Программа завершена');
  writableStream.end();
  rl.close();
  process.exit(0);
}
