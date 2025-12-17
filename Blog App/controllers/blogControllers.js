const user = require('../models/users.js');
const bcrypt = require('bcrypt');
require('dotenv').config();
const blog = require('../models/blogs.js');
const jwt = require('jsonwebtoken');


const handleErrors = (err) =>
{
    const errors =
    {
        name: '',
        email: '',
        password: ''
    }
    if(err.message === 'Incorrect Email!')
    {
        errors.email = 'The email is not registered!';
    }
    if(err.message === 'Incorrect Password!')
    {
        errors.password = 'The password is not correct!';
    }

    if(err.code==11000)
    {
        errors.email = "The email is already registered!"; 
    }

    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach(({properties}) =>
        {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const blogErrors = (err) => 
{
  let errors = { title: '', author: '', content: '' };

  if (err.message.includes('blog validation failed')) 
  {
        Object.values(err.errors).forEach(({ properties }) => 
        {
            errors[properties.path] = properties.message;
        });
  }
  return errors;
};


const maxAge = 3*24*60*60;
const createToken = (id) =>
{
    return jwt.sign({id}, process.env.JWT_SECRET, 
    {
        expiresIn: maxAge
    });
}

const get_req = async (req, res) =>
{
    const blogs = await blog.find();
    res.render('home', {blogs});
}

const post_signup = async (req, res) =>
{
    try 
    {
        const {name, email, password} = req.body;
        const User = await user.create({name, email, password});
        const token = createToken(User._id);
        res.cookie('jwt', token, 
        {
            httpOnly: true,
            maxAge: maxAge*1000
        });
        res.status(201).json({user: User._id});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const post_login = async (req, res) =>
{
    const {email, password} = req.body;
    const User = await user.findOne({email});
    try
    {
        if(User)
        {
            const auth = await bcrypt.compare(password, User.password);
            if(auth)
            {
                const token = createToken(User._id);
                res.cookie('jwt', token, 
                {
                    httpOnly: true,
                    maxAge: maxAge*1000
                })
                res.status(200).json({user: User._id});
            }
            else 
            {
                throw Error ("Incorrect Password!");
            }
        }
        else 
        {
            throw Error ("Incorrect Email!");
        }
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    
}

const post_blog = async (req, res) =>
{
    try 
    {
        const {title, author, content} = req.body;
        const userId = req.id;
        const Blog = await blog.create({userId, author, title, content});
        res.status(201).json({blog: Blog});
    }
    catch(err) 
    {
        const errors = blogErrors(err);
        res.status(400).json({errors});
    }

}

const delete_blog = async (req, res) =>
{
    try 
    {
        const userId = req.id;
        const {title, author} = req.body;
        const Blog = await blog.findOneAndDelete({ title, author, userId });
        res.status(200).json({blog: Blog});
    }
    catch(err) 
    {
        const errors = blogErrors(err);
        res.status(400).json({errors});
    }
}

const get_signup = (req, res) =>
{
    res.render('signup');
    
}

const get_blog = (req, res) =>
{
    res.render('blog');
    
}

const get_login = (req,res) =>
{
    res.render('login');
}

const get_logout = (req, res) =>
{
    res.cookie('jwt', '', 
    {
        maxAge: 1
    });
    res.redirect('/');
}

module.exports = {post_signup, post_login, get_signup, get_login, post_blog, get_blog, get_logout, get_req, delete_blog};