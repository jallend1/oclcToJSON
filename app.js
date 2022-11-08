const { createReadStream, writeFileSync, existsSync } = require('fs');
const readline = require('readline');
const { parse } = require('csv-parse');

const checkIfJSONExists = () => {
  if (existsSync('lendingLibraries.json')) {
    const inquirer = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    inquirer.question(
      'A json file already exists in this folder and will be overwritten. Press "Y" to proceed, or any other key to abort.',
      (res) => {
        if (res === 'Y' || res === 'y') {
          console.log('Proceeding...');
          extractDataFromCSV();
        } else {
          console.log(
            'Conversion aborted. Please rename or delete the existing json file and try again.'
          );
          process.exit(1);
        }
        inquirer.close();
      }
    );
  } else {
    extractDataFromCSV();
  }
};

const extractDataFromCSV = () => {
  const localDataSource = validateFile();
  const borrowingLibraries = [];
  createReadStream(localDataSource)
    .pipe(parse({ delimiter: '\t', from_line: 14, relax_column_count: true }))
    .on('data', (row) => {
      const locationInfo = {
        name: row[0],
        institutionSymbol: row[1],
        institutionState: row[2],
        lendingRequestsReceived: row[6],
        lendingRequestsFilled: row[7],
        lendingTurnAroundTime: row[12],
        loansFilled: row[8],
        copiesFilled: row[9]
      };
      borrowingLibraries.push(locationInfo);
    })
    .on('end', () => {
      writeFileSync(
        'lendingLibraries.json',
        JSON.stringify(borrowingLibraries),
        {
          encoding: 'utf8',
          flag: 'w'
        }
      );
    });
};

const getSourceFileFromCommandLine = (args) => {
  if (!args) {
    console.log('Usage: node app.js <filename>');
    process.exit(1);
  } else if (args === 'help') {
    console.log(
      "Accepts WorldShare Lender Transaction Detail Report in .tsv format in the app's directory and outputs a JSON file with the library's name, coordinates, and number of requests filled."
    );
    console.log('Usage: node app.js <filename>');
    console.log('Example: node app.js sep');
    process.exit(1);
  }
  return args.endsWith('.tsv') ? args : args + '.tsv';
};

const validateFile = () => {
  const args = getSourceFileFromCommandLine(process.argv[2]);
  if (!existsSync(args)) {
    console.log(`${args} does not exist in the current directory.`);
    process.exit(1);
  }
  return args;
};

checkIfJSONExists();
