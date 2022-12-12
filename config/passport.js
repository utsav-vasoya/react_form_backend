const User = require('../models/users');
const { Strategy, ExtractJwt } = require("passport-jwt");

const opt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "abcdefghijklo",
};
module.exports = (passport) => {
    passport.use(new Strategy(opt, async (payload, done) => {
        User.findOne({ _id: payload.user_id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};