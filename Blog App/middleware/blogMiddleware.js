const jwt = require('jsonwebtoken');
require('dotenv').config();
const requireAuth = (req, res, next) =>
{
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>
        {
            if(err) res.json({error: "Authentication failed"});
            else 
            {
                req.id = decodedToken.id;
                next();
            }
        })
    }
    else 
    {
        res.redirect('/login');
    }
}

module.exports = {requireAuth};