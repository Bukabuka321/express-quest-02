require("dotenv").config();

const express = require("express");

const {body, validationResults} = require("express-validator");

const Joi = require("joi");

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

const validateUser = ([
  body("email").isEmail(),
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResults(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
]);


app.get("/api/users/:id", userHandlers.getUsersById);
app.post( "/api/users", validateUser, userHandlers.postUser);
app.put("/api/users/:id", validateUser, userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);
app.get("/api/users", userHandlers.getUsersByParams);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
