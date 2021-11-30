const mongoose = require('mongoose');
const {questionsCollection} = require('../questions_csv.js');

const questionSchema = new mongoose.Schema({
  product_id: Number,
  body: String,
  date_written: String,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number
})

let Question = mongoose.model("questions", questionSchema);

async function insertQuestions () {
  questionsCollection().then(async (questions) => {
    let questionsChunk = [];
    const lastQuestion = questions.length - 1;

    for (let i = 0; i < questions.length; i++) {
      let currQuestion = questions[i];
      questionsChunk.push(currQuestion)

      if (i % 1000 === 0) {
        await Question.insertMany(questionsChunk)
      }

      if (i === lastQuestion) {
        await Question.insertMany(questionsChunk)
        console.log('finished inserting all questions to db')
      }
    }
  })
}

module.exports = Question