const user = require('../models/user.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const handleErrors = (err) => 
{
    let errors = 
    {
        email: '',
        password: ''
    };

    if(err.message === 'Incorrect Email!')
    {
        errors.email = 'The email is not registered!';
    }
    if(err.message === 'Incorrect Password!')
    {
        errors.password = 'The password is not correct!';
    }

    if(err.message.includes('user validation failed'))
    {
        (Object.values(err.errors)).forEach( ({properties}) =>  
        {
            errors[properties.path] = properties.message;
        });
    }

    if(err.code==11000)
    {
        errors.email = "The email is already registered!";
    }
    return errors;
}

const maxAge = 3*24*60*60;
const createToken = (id) =>
{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}


const signup_get = (req, res) =>
{
    res.render('signup');
}

const login_get = (req, res) =>
{
    res.render('login');
}

const signup_post = async (req, res) =>
{
    const {email, password} = req.body;
    try 
    {
       const User = await user.create({email, password});
       const token = createToken(User._id);
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
       res.status(201).json({user : User._id});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const login_post = async (req, res) =>
{
    const {email, password} = req.body;
    
    try 
    {
        const User = await user.login(email, password);
        const token = createToken(User._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: User._id});
    }
    catch (err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const logout_get = (req, res) =>
{
    res.cookie('jwt', '', 
    {
        maxAge: 1
    });
    res.redirect('/');
}

module.exports = {signup_get, login_get, signup_post, login_post, logout_get};