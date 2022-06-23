const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { syncBuiltinESMExports } = require('module');

const http = require('http').createServer(app);
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

require('dotenv').config();

app.set('view engine','ejs');

var db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },(err,client)=>{
    if(err){
        return console.log(err);
    }
    
    db = client.db('gameRecordData');

    app.listen(process.env.PORT, ()=>{
        console.log("server start!");
        console.log(`http://localhost:${process.env.PORT}`);
        console.log(`http://localhost:${process.env.PORT}/game`);
    });
});

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/game',(req, res)=>{
    db.collection('survive1Score').find().sort({score:-1}).toArray((err, result)=>{
        if(err){
            return console.log(err);
        }
        res.render('survive.ejs',{rankingResult : result});
    });
});

app.post('/upload',(req, res)=>{
    console.log('send success');
    console.log(req.body.score);
    saveThis={score : parseInt(req.body.score), nickname: req.body.nickname};
    db.collection('survive1Score').insertOne(saveThis,(err, result)=>{
        if(err){
            return console.log('upload fail');
        }
        res.redirect('/game');
        console.log(saveThis);
    });
});

