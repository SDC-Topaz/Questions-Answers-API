const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 1000;

app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose.connect('mongodb://localhost/Q&A', () => {console.log('connected')})