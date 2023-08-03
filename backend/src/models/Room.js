const mongoose = require('../db/conn')
const {Schema} = mongoose

const Room = mongoose.model(
    'Room',
    new Schema(
        {
            title:{
                type: String,
                required: true,
                unique: true,
            },
            password:{
                type: String
            },
            creator:{
                type: Object,
                required: true,
            },
            participants:{
                type:[{ObjectId}],
                ref:'User'
            }
        },{timestamps:true}
    )
)

module.exports = Room