const express = require('express');
const app = express();

app.get('/switcheroo', (req, res) => res.send('hello world'));

app.listen(3000, () => console.log('App is listening on localhost:3000'));