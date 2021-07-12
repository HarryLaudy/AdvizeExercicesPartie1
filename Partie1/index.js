const express = require('express');
const app = express();
var mongoose = require('mongoose');

const postUsr = require('./routes/Usr');

app.use(express.json());
app.use(express.urlencoded());
app.use('/users', postUsr);


app.get('/', (req, res) => {
    res.send('Hello, find users list in /users');

});

mongoose.connect('mongodb://localhost:27017', { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

if (!db)
    console.log('error connected db');

else
    console.log('db connected');

app.listen(1234);
