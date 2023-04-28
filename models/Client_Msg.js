const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const client_supportMsg_schema = new Schema({
    message: String,
    user_id: {
        type: String,
        required: true,
        trim: true,
        ref: 'users' // add a reference to the 'users' model
    },
    chat_status: String,
});

module.exports = mongoose.model('client_support', client_supportMsg_schema);
