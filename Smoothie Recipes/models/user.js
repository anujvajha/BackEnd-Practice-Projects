const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema 
(
    {
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

// hooks
userSchema.pre('save', async function (next) 
{
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); 
    next();
})

userSchema.statics.login = async function(email, password)
{
    const User = await this.findOne({email});
    if(User) 
    {
        const auth = await bcrypt.compare(password, User.password);
        if(auth) return User;
        else throw Error("Incorrect Password!");
    }
    else
    {
        throw Error("Incorrect Email!");
    }
}


module.exports = mongoose.model('user', userSchema);
