const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const cart_schema = new Schema({

   
    user_objId:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    
    cart_products:[
        {
            product:{
                type:mongoose.Types.ObjectId,
                ref:'products',
                required:true
            },
            quantity:Number,
            created_at: {
                type: Date,
                default: Date.now
              }
        }
    ]


});


module.exports = mongoose.model('carts',cart_schema);

