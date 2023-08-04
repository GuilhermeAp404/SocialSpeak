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
            description:{
                type: String
            },
            password:{
                type: String
            },
            creator:{
                type: Object,
                required: true,
            },
            participants:{
                type:[mongoose.Types.ObjectId],
                ref:'User'
            }
        },{timestamps:true}
    )
)

module.exports = Room