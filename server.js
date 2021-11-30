const mongoose = require('mongoose');
const Question = require('./schemas/questions.js')
const express = require('express');
const app = express();
const port = 1000;

app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose.connect('mongodb://localhost/Q&A', () => {console.log('connected')})