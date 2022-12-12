const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const passport = require("passport");
const jwt = require('jsonwebtoken');
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


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send({ msg: "Please Enter All Fields. " })
    }
    if (password.length < 6) {
        return res.send({ msg: 'Password must be at least 6 characters.' });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.send({ msg: 'That email is not registered.' });
                }
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        const token = jwt.sign(
                            { user_id: user._id },
                            "abcdefghijklo",
                            {
                                expiresIn: "24h",
                            }
                        );
                        user.token = token;
                        return res.send(user);
                    } else {
                        return res.send({ msg: 'Password incorrect.' });
                    }
                });
            });
    }
});

router.get('/home', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        return res.send("verify")
    } else {
        return res.send({ msg: "err....." })
    }
})

module.exports = router;