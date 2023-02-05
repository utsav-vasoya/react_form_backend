const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send({ msg: "Please Enter All Fields. " })
    }
    if (password.length < 6) {
        return res.send({ msg: 'Password must be at least 6 characters.' });
    } else {
        User.findOne({ email: req.body.email })
            .then(async user => {
                if (!user) {
                    return res.send({ msg: 'That email is not registered.' });
                }
                if (user.login_type == 'google') {
                    return res.send({ msg: 'Please login with google.' })
                }
                await bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
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
}

exports.googleAuth = async (req, res) => {
    console.log(req.user, req.isAuthenticated());
    if (req.isAuthenticated()) {
        jwt.sign({ user: req.user }, "secretKey", { expiresIn: "1h" }, (err, token) => {
            if (err) {
                return res.send({ msg: { token: null } });
            }
            res.cookie('name', req.user.name);
            res.redirect("http://localhost:3006/home")
        })
    } else {
        res.send({ msg: 'Unauthorized' });
    }
}