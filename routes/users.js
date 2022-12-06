const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const passport = require('passport');

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.send({ msg: "Please Enter All Fields. " })
    }
    if (password != confirmPassword) {
        return res.send({ msg: 'Your password and confirmation password do not match.' });
    }
    if (password.length < 6) {
        return res.send({ msg: 'Password must be at least 6 characters.' });
    } else {
        User.findOne({ email }).then(user => {
            if (user) {
                return res.send({ msg: 'Email already exists.' });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                return res.send('You are now registered and can log in.');
                            })
                            .catch(err => console.log(err));
                    });
                })
            }
        })
    }
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;