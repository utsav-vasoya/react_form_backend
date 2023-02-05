const express = require('express');
const router = express.Router();
const { register, login, googleAuth } = require('../Controllers/login');
const passport = require('passport');

router.post('/register', register);
router.post('/login', login);
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleAuth);

module.exports = router;