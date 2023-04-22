const mongoose = require('mongoose')

mongoose.set("strictQuery",true)
const url = process.env.DATA_BASE 

const connection = async ()=>{
    try {
        await mongoose.connect(url)
        console.log('connection to database')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connection;