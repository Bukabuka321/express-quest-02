require("dotenv").config();

const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 3000;

app.use(express.json());

const {hashPassword, getUserByEmailWithpassowrdAndPassToNext, verifyPassword, verifyToken} = require("./auth")


const userHandlers = require("./userHandlers");
// const welcome = (req, res) => {
//   res.send("Welcome to my favorite movie list");
// };

const welcome = (req, res) => {
  res.send("Welcome to my userlist");
};

app.get("/", welcome);

// const movieHandlers = require("./movieHandlers");

app.post(
  "/api/login",
  getUserByEmailWithpassowrdAndPassToNext,
  verifyPassword
);
app.post( "/api/users", hashPassword, userHandlers.postUser);
app.get("/api/users/:id", userHandlers.getUsersById);
app.get("/api/users", userHandlers.getUsersByParams);

app.use(verifyToken);

app.put("/api/users/:id",userHandlers.validateUser, userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);





app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
