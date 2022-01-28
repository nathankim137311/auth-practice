const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('connected to db!');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route middlewares
app.use('/api/user', authRoute); 
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server running on port 3000...'))
