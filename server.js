const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const http = require('http').createServer(app);

require('dotenv').config();

app.listen(3000, ()=>{
    console.log("server start!");
});
app.set('view engine','ejs');

app.get('/', function (req, res) {
    res.render('index.ejs');
  });