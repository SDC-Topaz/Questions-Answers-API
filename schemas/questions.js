const mongoose = require("mongoose");
const {
  parseQuestions,
  parseAnswers,
  parsePhotos,
} = require("../questions_csv.js");

const questionSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: String,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: Number,
      question_id: Number,
      body: String,
      date_written: String,
      answerer_name: String,
      answerer_email: String,
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: Number,
          answer_id: Number,
          url: String,
        },
      ],
    },
  ],
});

let Question = mongoose.model("questions", questionSchema);

async function insertQuestions() {
  return new Promise((resolve, reject) => {
    parseQuestions().then(async (questions) => {
      let questionsChunk = [];
      const lastQuestion = questions.length - 1;

      for (let i = 0; i < questions.length; i++) {
        let currQuestion = questions[i];
        questionsChunk.push(currQuestion);

        if (i % 1000 === 0) {
          await Question.insertMany(questionsChunk, { ordered: false });
          questionsChunk = [];
          console.log("added 1000 questions");
        }

        if (i === lastQuestion) {
          await Question.insertMany(questionsChunk);
          console.log("finished inserting all questions to db");
          resolve("moving onto answers");
        }
      }
    });
  });
}

async function insertAnswers() {
  return new Promise((resolve, reject) => {
    parseAnswers().then(async (answers) => {
      const lastAnswer = answers.length - 1;
      let answersChunk = [];

      for (let i = 0; i < answers.length; i++) {
        let currAnswer = answers[i];
        answersChunk.push(currAnswer);

        if (i % 1000 === 0) {
          console.log(
            answersChunk[0].id,
            answersChunk[answersChunk.length - 1].id
          );
          for (let i = 0; i < answersChunk.length; i++) {
            let answer = answersChunk[i];
            await Question.updateOne(
              { id: answer.question_id },
              { $push: { answers: answer } }
            );
          }
          answersChunk = [];
          console.log("added 1000 answers");
        }

        if (i === lastAnswer) {
          for (let i = 0; i < answersChunk.length; i++) {
            let answer = answersChunk[i];
            await Question.updateOne(
              { id: answer.question_id },
              { $push: { answers: answer } }
            );
          }
          console.log("finished inserting all answers into db");
          resolve("done");
        }
      }
    });
  });
}

async function insertPhotos() {
  return new Promise((resolve, reject) => {
    parsePhotos().then(async (photos) => {
      const lastPhoto = photos.length - 1;

      for (let i = 0; i < photos.length; i++) {
        let currPhoto = photos[i];
        await Question.updateOne(
          { "answers.id": currPhoto.answer_id },
          { $push: { "answers.$[].photos": currPhoto } }
        );

        if (i % 1000 === 0) {
          console.log("added 1000 photos");
        }

        if (i === lastPhoto) {
          console.log("finished inserting all photos into db");
          resolve("done");
        }
      }
    });
  });
}

async function insertIntoDatabase() {
  await insertQuestions();
  console.log("moving onto answers");
  await insertAnswers();
  console.log("moving onto photos");
  await insertPhotos();
  console.log("Finally Finished!!!");
}

//insertIntoDatabase();
module.exports = Question;
