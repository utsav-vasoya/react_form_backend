const express = require('express');
const expresslayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const cookieparser = require("cookie-parser");
const session = require('express-session');
const cors = require('cors');
// Passport Config
require('./config/passport')(passport);
const db = require('./config/keys').mongoURL;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))
app.use(expresslayout);
app.use(express.json())
app.use(cookieparser());
app.use(cors());
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/users', require('./routes/users'));




const port = process.env.PORT || 4000;

app.listen(port, console.log(`server listiong at port ${port}`))