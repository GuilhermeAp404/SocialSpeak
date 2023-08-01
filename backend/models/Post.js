const mongoose = require('../db/conn')
const {Schema} = mongoose

const Post = mongoose.model(
    'Post',
    new Schema(
        {
            text:{
                type: String,
                required: true
            },
            author:{
                type: Object,
                required: true
            },
            likes:{
                type:[Object]
            },
            comments:{
                type:[Object]
            }
        }, {timestamps: true}
    )
)

module.exports = Post