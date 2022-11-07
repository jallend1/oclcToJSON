const { createReadStream, createWriteStream, readFileSync } = require('fs');
const { validateFile } = require('./commandLine');

const sourceFileName = validateFile();
console.log(sourceFileName);
