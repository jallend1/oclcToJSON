# OCLC Stats to JSON

Converts key stats from OCLC's WorldShare Interlibrary Loan Data into JSON

## Description

Takes the exported TSV file from the monthly WorldShare ILL stats page and creates a JSON object containing the following information from each library that received a request:

- The institution symbol
- The institution's state
- The number of lending requests received from that library
- The number of lending requests filled for that library
- The average turnaround time for filled requests
- The number of loan requests filled
- The number of copy requests filled

## Getting Started

### Dependencies

csv: ^6.2.1

### Executing the Program

- Move your .tsv file from OCLC into the app's directory

```
npm install
```

```
node app <filename>
```

- App creates a file named lendingLibraries.json in the app directory
