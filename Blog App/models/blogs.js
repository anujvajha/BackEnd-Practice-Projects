const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema
(
    {
        userId:
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',                          
            required: true     

        },
        author:
        {
            type: String,
            required: [true, "Please enter the name of the author"],
        },

        title:
        {
            type: String, 
            required: [true, "Please enter the title of the blog"],
        },
        content:
        {
            type: String, 
            required: [true, "Please enter the content of the blog"],
        }
    }
)


module.exports = mongoose.model('blog', blogSchema);