const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.listen(3100, () => {
    console.log("App is running at port 3100!!")
})

app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/dashboard", (req, res) => {
    res.render('dashboard')
})
app.get("/g2", (req, res) => {
    res.render('g2')
})
app.get("/g", (req, res) => {
    res.render('g')
})