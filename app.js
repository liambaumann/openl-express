const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config() // adding dotenv functionality

var mysql = require('mysql');
var connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD});


app.get('/', (req, res) => {
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) 
            throw err;
        
        console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
    res.send('Hello World, from express. My solution: ' + process.env.SECRET_MESSAGE);
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
