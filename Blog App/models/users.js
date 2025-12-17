const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema
(
    {
        name: 
        { 
            type: String, required: [true, 'Please enter your name!'], 
            minlength: [3, "Name must be of atleast 3 characters!"]
        },
        email:
        {
            type: String, 
            required: [true, 'Please enter an email!'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'Please enter a valid email!']
        },
        password:
        {
            type: String, 
            required: [true, 'Please enter a password!'],
            minlength: [6, 'Please enter a password of minimum 6 characters!']
        }
    }
)

userSchema.pre('save', async function ()
{
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('user', userSchema);