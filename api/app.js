const express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
const app = express();
var db = require('./helpers/db')();
var admin = require('./views/admin');
var customer = require('./views/customer');
var payment = require('./views/payment');
var routes = require('./views/index');

/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/
app.use(cors())
app.use(bodyParser.json());
app.use('/', routes);
app.use('/admin', admin);
app.use('/customer', customer);
app.use('/payment', payment)


app.set('view engine', 'jade');

app.listen(process.env.PORT || 8080);