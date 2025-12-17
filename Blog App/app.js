const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/blogRoutes.js');
const cookieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/blogMiddleware.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser());

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => 
    {
        app.listen(PORT, () => { console.log(`Listening to requests on PORT ${PORT}`); });
    } )
    .catch((err) => {console.log(err); } )


app.get('/createBlog', requireAuth, (req, res) =>
{
    res.render('blog');
})

app.get('/deleteBlog', requireAuth, (req, res) =>
{
    res.render('delete');
})

app.use(routes);

