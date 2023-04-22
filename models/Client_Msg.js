const mongoose = require('mongoose');


const Schema = mongoose.Schema

const client_supportMsg_schema = new Schema({
    message:String,
    user_email:String,
    chat_status:String,
})

module.exports = mongoose.model('client_support', client_supportMsg_schema)