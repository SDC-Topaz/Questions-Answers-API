const fs = require('fs');
const csv = require('@fast-csv/parse');


function parsePhotos () {
  return new Promise((resolve,reject) => {
    let photos = {}
    fs.createReadStream('./csv_files/answers_photos.csv')
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        row.id = Number(row.id);
        row.answer_id = Number(row.answer_id);
        //console.log(row)
        if (!photos[row.answer_id]) {
          photos[row.answer_id] = [row];
        } else {
          photos[row.answer_id].push(row);
        }
      })
      .on('end', rowCount => resolve(photos));
  })
}
//parsePhotos()

function parseAnswers(photos) {
  return new Promise((resolve, reject) => {
    let answers = {}
    fs.createReadStream('./csv_files/answers.csv')
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        row.id = Number(row.id);
        row.question_id = Number(row.question_id);
        row.reported = Number(row.reported);
        row.helpful = Number(row.helpful);
        row.photos = photos[row.id]

        if (!answers[row.question_id]) {
          answers[row.question_id] = [row];
        } else {
          answers[row.question_id].push(row);
        }
      })
      .on('end', rowCount => resolve(answers));
  })
}
//parseAnswers()


function parseQuestions(answers) {
  return new Promise((resolve, reject) => {
    let questions = []
    fs.createReadStream('./csv_files/questions.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      row.id = Number(row.id)
      row.product_id = Number(row.product_id);
      row.reported = Number(row.reported);
      row.helpful = Number(row.helpful);
      row.answers = answers[row.id]
      questions.push(row)
    })
    .on('end', rowCount => resolve(questions));
  });
}


async function questionsCollection() {
  let photos = await parsePhotos();
  let answers = await parseAnswers(photos);
  let questions = await parseQuestions(answers);
  return questions;
}

module.exports = {questionsCollection}