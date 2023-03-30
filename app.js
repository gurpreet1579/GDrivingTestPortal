const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const expressSession = require('express-session');

// using expressSession to maintain session 
app.use(expressSession({
    secret: 'bigSecret',
    resave: false,
    saveUninitialized: false
  }));
    
const DB = require('./config/mongoose');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.listen(3100, () => {
    console.log("App is running at port 3100!!")
})

app.use('/', require('./routes'));