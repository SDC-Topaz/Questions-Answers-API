const mongoose = require("mongoose");
const Question = require("./schemas/questions.js");
const express = require("express");
const app = express();
const port = 1000;

const morgan = require("morgan");
const cors = require("cors");

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost/Q&A", () => {
  console.log("connected");
});

app.get("/questions/:product_id", async (req, res) => {
  let id = req.params.product_id;

  try {
    const getQuestions = await Question.find({ product_id: id });
    res.send(getQuestions);
  } catch (e) {
    console.log(e.message);
  }
});
