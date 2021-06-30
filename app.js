const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const todoRoutes = require('./api/routes/todo');

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, x-Requested-With, Conten-Type, Sccept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-allow-Methods', 'PUT, POST, PATCH', 'DELETE', 'GET');
        return res.status(200).json({})
    }
    next();
});

app.use('/api', userRoutes);
app.use('/api', todoRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req,res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports= app;