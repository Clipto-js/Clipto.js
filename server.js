const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')

require('dotenv').config({path: __dirname + '/.env'})
const app = express();
app.use(bodyParser.json());

aws.config.update({
    region: process.env.region,
    accessKeyId: process.env.accessKey,
    secretAccessKey: process.env.secretKey
});
//dynamoDB client
const dbClient = new aws.DynamoDB.DocumentClient();
mongoose.connect(process.env.mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected,,'))
    .catch((err) => console.log(err));
//EJS
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


// app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.get('/getUserData/:userId',async(req,res)=>{
    console.log(req.params)
    const userId = req.params.userId;
    console.log(userId);
    var params = {
        TableName: 'DataTable',
        Key:{
            'userId':userId 
        }
    };
    const db = dbClient.get(params).promise();
   
    const data = await db;
    res.send(data);   
})
app.post('/saveUserData',async(req,res)=>{
    const data = req.body;
    const params = {
        TableName:'DataTable',
        Item:{
            userId:data.userId,
            name:data.name,
            cardData:data.cardData
        }
    }
    const db = dbClient.put(params).promise();
    await db;
    res.status(200).send();
})

app.listen(8081, ()=>{
    console.log('listening to 8081');
})









