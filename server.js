const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const http = require('http').createServer(app);
app.use('/public', express.static('public'));

require('dotenv').config();

app.listen(process.env.PORT, ()=>{
    console.log("server start!");
});
app.set('view engine','ejs');

app.get('/', function (req, res) {
    res.render('index.ejs');
  });

MongoClient.connect(process.env.DB_URL,{useUnfiedTopolgy: true},(err,client)=>{
    if(err){
        return console.log('did not loading');
    }
})