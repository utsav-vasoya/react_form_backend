const { request } = require('express');
const express = require('express');
const expresslayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
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
app.set('view engine', 'ejs')
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

// Connect flash
app.use(flash());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));




const port = process.env.PORT || 4000;

app.listen(port, console.log(`server listiong at port ${port}`))