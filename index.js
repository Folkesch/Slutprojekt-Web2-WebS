const express = require("express");
const mysql = require('mysql2/promise');
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const fs = require('fs');

//Admin: username: Admin, pass: AdminPass

const COOKIE_MASTER_KEY = "MasterPassword";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Folke2007",
  database: "SlutprojektDB",
  multipleStatements: false
});

const app = express();
app.use(express.static("public"));
app.use("/image", express.static("images"));

app.use(express.json());
app.use(cookieParser());

// this route adds a new user the the server based on the callers input
// @param body.password, body.username
// @return null.
app.post("/createAccount", async (appReq, appRes) => {

  if (!appReq.body.username || !appReq.body.password)
  {
    appRes.sendStatus(400);
    console.log(appReq.body.username, appReq.body.password)
  }
  else
  {
    try {
      const userExistsQuery = "SELECT userID FROM users WHERE username = ?";
      const [userID, fields] = await pool.execute(userExistsQuery, [appReq.body.username]);
  
      if (userID.length != 0)
      {
        appRes.status(409);
        appRes.send("This usermane is already taken");
      }
      else
      {
        const createUserQuery = "INSERT INTO users (username, userPassword) VALUES (?, ?);";
  
        const hashedPassword = bcrypt.hashSync(appReq.body.password, 10);
  
        await pool.execute(createUserQuery, [appReq.body.username, hashedPassword]);
  
        appRes.status(200);
        appRes.send("Signup successful!");
      }
  
    }
    catch (e)
    {
      console.log(e);
      appRes.sendStatus(500);
    }
  }

});

// this route adds cookeis on the users browser if they provide teh right authentication 
// @param body.password, body.username
// @return cookies [authentication]
app.post("/LogIn", async (appReq, appRes) => {

  try
  {
    const getPasswordAndIDQuery = "SELECT userID, userPassword FROM users WHERE username = ?";
    const [hashedPasswordAndID, fields] = await pool.execute(getPasswordAndIDQuery, [appReq.body.username]);

    if (hashedPasswordAndID.length == 0)
    {
      appRes.status(401);
      appRes.send("Wrong username");
    }
    else
    {
      const rightPass = bcrypt.compareSync(appReq.body.password, hashedPasswordAndID[0].userPassword);
      if (rightPass)
      {
        appRes.status(200);

        // create cookies
        const token = jwt.sign({ "userID": hashedPasswordAndID[0].userID, "username": appReq.body.username }, COOKIE_MASTER_KEY, { expiresIn: "8h" });
        // add cookies to the respones
        appRes.cookie("token", token, {
          httpOnly: true,
          expiresIn: 8 * 60 * 60,
          path: "/",
          secure: true,
          sameSite: "strict"
        });

        appRes.send("Login successful")
      } else {
        appRes.status(401);
        appRes.send("Wrong password");
      }
    }

  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }

});

// this route removes the cookeis on the users browser
// @param cookies [authentication]
// @return null
app.post("/LogOut", async (appReq, appRes) => {
  appRes.clearCookie("token");
  appRes.status(200);
  appRes.send("Cookie has been cleared!");
});

// this route returns the users username based on there cookeis
// @param cookies [authentication]
// @return username
app.get("/username", async (appReq, appRes) => {

  const token = appReq.cookies.token;

  if (!token)
  {
    appRes.sendStatus(401);
  }
  else
  {
    try {
      const obj = jwt.verify(token, COOKIE_MASTER_KEY);
      appRes.status(200);
      appRes.send(obj.username);
    } catch (e) {
      appRes.sendStatus(401);
    }
  }
});

// this route takes a review as an input and upploades it to the server
// @param cookies [authentication], body.movieID, body.rating, body.content [written review]
// @return succes or not
app.post("/review", async (appReq, appRes) => {
  const token = appReq.cookies.token;

  // return if no cookies found
  if (!token)
  {
    appRes.status(401);
    appRes.send("You are not logged in. Please log in");
  }
  else
  {
    try {
      // get all relevant data 
      const obj = jwt.verify(token, COOKIE_MASTER_KEY);

      const userID    = obj.userID; // USER ID
      const movieID   = appReq.body.movieID;
      const rating    = appReq.body.rating;
      let content;
      if (!appReq.body.content)
      {
        // if body is empty return null not ""
        content = null;
      }
      else
      {
        content = appReq.body.content;
      }

      const checkForOldReviewQuery = "SELECT rating FROM reviews WHERE movieID = ? AND userID = ?";
      const [OldQueryRes, OldFields] = await pool.execute(checkForOldReviewQuery, [movieID, userID]);

      if (OldQueryRes.length == 0)
      {
        // if the user have upploaded an review uppdate the old one
        const query = "INSERT INTO reviews (userID, movieID, rating, content) VALUES (?, ?, ?, ?)";
        const [queryRes, fields] = await pool.execute(query, [userID, movieID, rating, content]);
  
        appRes.status(201);
        appRes.send("Review uploaded successfully");
      }
      else
      {
        const updateReviewQuery = "UPDATE reviews SET rating = ?, content = ? WHERE movieID = ? AND userID = ?";
        const [queryRes, fields] = await pool.execute(updateReviewQuery, [rating, content, movieID, userID]);

        appRes.status(200);
        appRes.send("Review updated successfully");
      }

    } catch (e) {
      appRes.sendStatus(500);
      console.log(e);
    }
  }
});

// this route returns a JSON list of all the reviews of the movie with the moveID from tht input
// @param query.sortBy [how to sort], query.filterStars [how to filter], query.movieID [movie ID]
// @return username, rating, content
app.get("/reviews", async (appReq, appRes) => {

  // set the sortBy var to the relevent value based on query.sortBy
  let sortBy;
  if (appReq.query.sortBy == "most-relevent")
  {
    sortBy = "RAND()";
  }
  else if (appReq.query.sortBy == "latest")
  {
    sortBy = "reviews.uploadTime DESC";
  }
  else if (appReq.query.sortBy == "oldest")
  {
    sortBy = "reviews.uploadTime ASC";
  }
  else
  {
    appRes.sendStatus(422);
    return;
  }
  // set the filterStars var to the relevent value based on query.filterStars
  let filterStars;
  switch (appReq.query.filterStars) {
    case "all-stars":
      filterStars = ""
      break;
    case "1":
      filterStars = "AND reviews.rating = 1"
      break;
    case "2":
      filterStars = "AND reviews.rating = 2"
      break;
    case "3":
      filterStars = "AND reviews.rating = 3"
      break;
    case "4":
      filterStars = "AND reviews.rating = 4"
      break;
    case "5":
      filterStars = "AND reviews.rating = 5"
      break;
    default:
      appRes.sendStatus(422);
      return;
      break;
  }  

  // adding filterStars and sortBy to the query
  const query = "SELECT username, rating, content FROM reviews LEFT JOIN users ON reviews.userID = users.userID WHERE reviews.movieID = ? " + filterStars + " ORDER BY " + sortBy + " LIMIT 20";
  try
  {
    const [queryResult, fields] = await pool.execute(query, [appReq.query.movieID]);
  
    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
});

// this route returns a JSON list of all the movies thet match the input by name
// @param query.movieName [movie name]
// @return movieTitel, movieID
app.get("/moviesByName", async (appReq, appRes) => {
  const query = "SELECT movieTitel, movieID FROM movies WHERE movieTitel LIKE ? ORDER BY movieTitel ASC LIMIT 10";
  try
  {
    const [queryResult, fields] = await pool.execute(query, [appReq.query.movieName + "%"]);
  
    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
});

// this route returns a JSON list of recomended movies and the relevent information of the movies
// @param none
// @return movieID, movieTitel, SUM(rating) as scoreSum, COUNT(rating) as scoreCount
app.get("/recommendedMovies", async (appReq, appRes) => {
  const query = "SELECT movies.movieID, movieTitel, SUM(rating) as scoreSum, COUNT(rating) as scoreCount FROM movies LEFT JOIN reviews ON movies.movieID = reviews.movieID GROUP BY movieID ORDER BY RAND() LIMIT 7;";
  try
  {
    const [queryResult, fields] = await pool.query(query);

    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
});

// this route returns a JSON of all the relevent information of a movie
// @param query.id [movie id]
// @return movieID, movieTitel, movieDescription, movieLength, releaseDate, SUM(rating) as scoreSum, COUNT(rating) as scoreCount
app.get("/movieData", async (appReq, appRes) => {
  const query = "SELECT movies.movieID, movieTitel, movieDescription, movieLength, releaseDate, SUM(rating) as scoreSum, COUNT(rating) as scoreCount FROM movies LEFT JOIN reviews ON movies.movieID = reviews.movieID WHERE movies.movieID = ? GROUP BY movieID"
  try
  {
    const [queryResult, fields] = await pool.execute(query, [appReq.query.id]);
  
    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
});

// this route sends back a JSON of all actors, and what they playes, that are in the move.
// @param query.id [actor id]
// @return actorID, firstName, lastName, characterPlayed
app.get("/actors", async (appReq, appRes) => {
  const query = "SELECT actors.actorID, firstName, lastName, characterPlayed FROM movieToActor LEFT JOIN actors ON actors.actorID = movieToActor.actorID WHERE movieID = ?"
  try
  {
    const [queryResult, fields] = await pool.execute(query, [appReq.query.id]);
  
    appRes.status(200);
    appRes.send(JSON.stringify(queryResult));
  }
  catch (e)
  {
    console.log(e);
    appRes.sendStatus(500);
  }
});



app.listen(8080);
console.log("server is running");
