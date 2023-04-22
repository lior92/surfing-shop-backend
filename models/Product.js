const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const product_schema = new Schema({

    product_category:{
        type:String,
        required: true,
        trim: true
    },
    product_name:{
        type:String,
        required: true,
        // match: /^.{0,20}$/,
        trim: true
    },
    product_description:{
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    product_price:{
        type:Number,
        trim: true,
    },
    product_image: {
        required: true,
        type:String,
        trim:true
    }

});


module.exports = mongoose.model('products',product_schema);