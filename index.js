const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PouchDB = require('pouchdb');

const PORT = 9000;

const app = express();
const db = new PouchDB('submissions');

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/submit', (req, res) => {
  console.log('SUBMISSION: '+JSON.stringify(req.body));
  const {
    email,
    responses
  } = req.body
  const newSubmission = {
    _id: email,
    responses
  };
  db.put(newSubmission)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      // TODO: Check for duplicate emails here and report to client
      console.error(JSON.stringify(err));
      res.sendStatus(500);
    })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Strive questionnaire server listening on port ${PORT}`);
});
