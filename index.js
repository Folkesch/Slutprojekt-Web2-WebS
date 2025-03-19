const express = require("express");
const mysql = require('mysql2/promise');
const fs = require('fs');

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Folke2007",
  database: "SlutprojektDB"
});

const app = express();
app.use(express.static("public"));
app.use("/image", express.static("images"));



app.get("/moviesByName", async (appReq, appRes) => {
  try
  {
    const query = "SELECT movieTitel, movieID FROM movies WHERE movieTitel LIKE ? ORDER BY movieTitel ASC LIMIT 10"
    const [queryResult, fields] = await pool.execute(query, [appReq.query.movieName + "%"]);
  
    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
})






















// TESTS =============================================================================
/*
async function func() {
  try
  {
    const query = "SELECT movieTitel, movieID FROM movies WHERE movieTitel LIKE ? ORDER BY movieTitel ASC LIMIT 10"
    const [queryResult, fields] = await pool.execute(query, ["Toy" + "%"]);
  
    console.log(queryResult);
  }
  catch (e)
  {
    console.log(e);
    //appRes.sendStatus(500);
  }
}

func();
*/
app.listen(8080);
console.log("server is running")