const fs = require("fs");
const csv = require("@fast-csv/parse");

//let chunk = 10;

function parsePhotos() {
  return new Promise((resolve, reject) => {
    let photos = [];
    fs.createReadStream("./testcsv/photos.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.id = Number(row.id);
        row.answer_id = Number(row.answer_id);

        if (!isNaN(row.id) && !isNaN(row.answer_id)) {
          photos.push(row);
        }
      })
      .on("end", (rowCount) => resolve(photos));
  });
}

function parseAnswers() {
  return new Promise((resolve, reject) => {
    let answers = [];
    fs.createReadStream("./testcsv/answers.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.id = Number(row.id);
        row.question_id = Number(row.question_id);
        row.reported = Number(row.reported);
        row.helpful = Number(row.helpful);

        if (
          !isNaN(row.id) &&
          !isNaN(row.question_id) &&
          !isNaN(row.reported) &&
          !isNaN(row.helpful)
        ) {
          answers.push(row);
        }
      })
      .on("end", (rowCount) => resolve(answers));
  });
}

function parseQuestions() {
  return new Promise((resolve, reject) => {
    let questions = [];
    fs.createReadStream("./csv_files/questions.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.id = Number(row.id);
        row.product_id = Number(row.product_id);
        row.reported = Number(row.reported);
        row.helpful = Number(row.helpful);

        if (
          !isNaN(row.id) &&
          !isNaN(row.product_id) &&
          !isNaN(row.reported) &&
          !isNaN(row.helpful)
        ) {
          questions.push(row);
        }
      })
      .on("end", (rowCount) => resolve(questions));
  });
}

// async function questionsCollection() {
//   let photos = await parsePhotos();
//   let answers = await parseAnswers(photos);
//   let questions = await parseQuestions(answers);
//   return questions;
// }

// async function parsedQuestions() {
//   let allQuestions = await parseQuestions();
//   return allQuestions;
// }

module.exports = { parseQuestions, parseAnswers, parsePhotos };
