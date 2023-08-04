const mongoose = require('../db/conn')
const {Schema} = mongoose

const User = mongoose.model(
    'User',
    new Schema (
        {
            name:{
                type: String,
                unique: true
            },
            email:{
                type: String,
                required: true
            },
            password:{
                type:String,
                required: true,
            },
            image:{
                type: String,
            },
            tag:{
                type: String,
                unique: true,
                required: true,
            },
        }, {timestamps: true}
    ),
)

module.exports = User