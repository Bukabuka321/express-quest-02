require("dotenv").config();

const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 3000;

app.use(express.json());


const userHandlers = require("./userHandlers");
// const welcome = (req, res) => {
//   res.send("Welcome to my favorite movie list");
// };

const welcome = (req, res) => {
  res.send("Welcome to my userlist");
};

app.get("/", welcome);

// const movieHandlers = require("./movieHandlers");

// app.get("/api/movies", movieHandlers.getMovies);

// app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);
app.post("/api/users", userHandlers.postUser);
app.put("/api/users/:id", userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);
app.get("/api/users", userHandlers.getUsersByParams);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
