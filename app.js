const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config()  //adding dotenv functionality

app.get('/', (req, res) => {
    res.send('Hello World, from express. My secret: ' + process.env.SECRET_MESSAGE);
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))