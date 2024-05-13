var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const con_string = "mongodb+srv://goncalopinto07102003:Y24OQFKGUftnYECB@cluster0.wxmwzsu.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(con_string);

mongoose.connection.on('connected', function() {
    console.log('Successfully connected to MongoDB');
});

mongoose.connection.on('error', function(err) {
    console.error('Failed to connect to MongoDB:', err);
});

const websiteRouter = require('./routes/website');
const websitesListRouter = require('./routes/websites');
const initRouter = require('./routes/init');

const webpageRouter = require('./routes/webpage');
const webpagesListRouter = require('./routes/webpages');

app.use(express.json());
app.use('/website', websiteRouter);
app.use('/websites', websitesListRouter);
app.use('/init', initRouter);
app.use('/webpage', webpageRouter);
app.use('/webpages', webpagesListRouter);

/* GET home page. */
app.get('/', (req, res) => {
  res.send('Home Page.');
});

app.listen(8080);