const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/authMiddleware.js');

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_CONNECTION)
  .then((result) => app.listen(PORT, () => {console.log(`Listening to port ${PORT}`);} ))
  .catch((err) => console.log(err));


app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => 
{
    res.render('smoothies');
});

app.use(authRoutes);

