const mongoose = require('mongoose');
//Sometimes unique key are not working properly, so we need to use this package
const uniqueValidator = require('mongoose-unique-validator');




const Schema = mongoose.Schema

const user_schema = new Schema({
    user_name:{
        type:String,
        required: true,
        unique: true,
        // match: /^.{0,20}$/,
        trim: true
    },
    user_email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    user_phone:{
        type:String,
        required: true,
        trim: true,
    },
    user_address:{
        type:String,
        required: true,
        trim: true,
    },
    user_password:{
        type:String,
        required: true,
        trim: true,
        // match:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    },
    user_permission:{
        type:Number,
        default:1
    },
    user_carts: [
        {
            cart:{
                type: mongoose.Types.ObjectId,
                ref:'carts'
            }
        }
    ]
})

user_schema.plugin(uniqueValidator);
module.exports = mongoose.model('users', user_schema)