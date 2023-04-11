const mongoose = require('mongoose')

const {Schema, model } = mongoose;

const chatSchema = Schema({
    message: String,
    name: String, 
    timestamp: String,
    recieved : Boolean,
    roomID : String,

},
{ timestamps: true }


)



const MESSAGES = model('messageContent', chatSchema)



module.exports = MESSAGES