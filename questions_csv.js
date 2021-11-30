const fs = require('fs');
const csv = require('@fast-csv/parse');

function questionsCollection() {
  return new Promise((resolve, reject) => {
    let results = []
    fs.createReadStream('./csv_files/questions.csv')
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        row.product_id = Number(row.product_id);
        row.reported = Number(row.reported);
        row.helpful = Number(row.helpful);
        results.push(row)
      })
      .on('end', rowCount => resolve(results));
  });
}

module.exports = {questionsCollection}