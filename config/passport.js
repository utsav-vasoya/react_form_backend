const User = require('../models/users');
const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: "612292622863-od24d7805hqi7q9ih0lbaqtvo2blkkku.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://localhost:4000/users/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ 'email': profile.emails[0].value });
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User({
                        login_type: "google",
                        email: profile.emails[0].value,
                        name: profile.displayName
                    });
                    await newUser.save();
                    return done(null, newUser);
                }
            } catch (err) {
                console.error(err)
            }
        }
    )
    )
};