const { createReadStream, writeFileSync } = require('fs');
const { validateFile } = require('./commandLine');
const { parse } = require('csv-parse');

const extractDataFromCSV = (localDataSource) => {
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

const sourceFileName = validateFile();
extractDataFromCSV(sourceFileName);
