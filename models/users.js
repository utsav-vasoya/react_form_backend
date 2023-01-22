const mongoose = require('mongoose');
const Userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    token:{
        type: String
    },
    login_type:{
        type:String,
        default:"Custom"
    }
})

const User = mongoose.model('User', Userschema);
module.exports = User;