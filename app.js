const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config() // adding dotenv functionality


const mariadb = require('mariadb');
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);
/*const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, database: process.env.DB_NAME, password: process.env.DB_PASSWORD, debug: false});

pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT 1 as val")
        .then((rows) => {
          console.log(rows); //[ {val: 1}, meta: ... ]
          //Table must have been created before 
          // " CREATE TABLE myTable (id int, val varchar(255)) "
          return conn.query("INSERT INTO mytable value ('hallo', 1)", [1, "mariadb"]);
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
      //not connected
      console.log("could not connect")
      console.log(err)
    });
*/

mariadb.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD})
  .then(conn => {
    conn.query("select 1", [2])
      .then(rows => {
        console.log(rows); // [{ "1": 1 }]
        conn.end();
      })
      .catch(err => { 
        //handle query error
      });
  })
  .catch(err => {
    //handle connection error
    console.log(err);
  });

app.get('/', (req, res) => {
    res.send('Hello World, from express. My solution: ' + process.env.SECRET_MESSAGE);
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
