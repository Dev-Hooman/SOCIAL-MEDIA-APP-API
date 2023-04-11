const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    photoUrl: String,
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "SubscribedUser"]
    },
    username: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true,
    },


}, { timestamps: true })


module.exports = model('users', UserSchema) 