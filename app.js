const express = require("express");
const app = express();
const port = 8080;
require("dotenv").config(); // adding dotenv functionality

const mariadb = require("mariadb");
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

const pool = mariadb.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, database: process.env.DB_NAME, password: process.env.DB_PASSWORD });

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.log("Database connection lost");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has too many connection");
        }
        if (err.code === "ECONNREFUSED") {
            console.error("Database connection was refused");
        }
    }
    if (connection) connection.release();

    return;
});

app.get("/", async (req, res) => {
    try {
        const sqlQuery = "SELECT cName, cCode, cId FROM courses";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.get("/courses", async (req, res) => {
    const id = req.query.id;
    const code = req.query.code;
    if (typeof id === "undefined" && typeof code === "undefined") {
        try {
            const sqlQuery = "SELECT cName, cCode, cId FROM courses";
            const rows = await pool.query(sqlQuery);
            res.status(200).json(rows);
            return;
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
    console.log(typeof id);
    console.log(typeof code);
    if (typeof id !== "undefined" && typeof code !== "undefined") {
        try {
            const sqlQuery = "SELECT cName, cCode, cId FROM courses WHERE cId=? AND cCode=?";
            const rows = await pool.query(sqlQuery, [id, code]);
            res.status(200).json(rows);
            return;
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
    if (typeof id !== "undefined") {
        try {
            const sqlQuery = "SELECT cName, cCode, cId FROM courses WHERE cId=?";
            const rows = await pool.query(sqlQuery, [id]);
            res.status(200).json(rows);
            return;
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
    if (typeof code !== "undefined") {
      try {
          const sqlQuery = "SELECT cName, cCode, cId FROM courses WHERE cCode=?";
          const rows = await pool.query(sqlQuery, [code]);
          res.status(200).json(rows);
          return;
      } catch (err) {
          res.status(400).send(err.message);
      }
  }
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
