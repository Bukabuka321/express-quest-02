const database = require("./database");

const Joi = require("joi");

const userSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
  });
  
  const validateUser = (req, res, next) => {
    const { firstname, lastname, email } = req.body;
  
    const { error } = userSchema.validate(
      { firstname, lastname, email },
      { abortEarly: false }
    );
  
    if (error) {
      res.status(422).json({ validationErrors: error.details });
    } else {
      next();
    }
  };
  

const getUsers = (req, res) => {
    database
    .query("SELECT * FROM users")
    .then((result) => {
        const users = result[0]
        res.json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    })
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
    database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
        if(users[0] != null) {
            res.json(users[0]);
        } else {
            res.status(404).send("User not found");
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    })
};


const postUser = (req, res) => {

    const {firstname, lastname, email, city, language, hashedPassword} = req.body;
    database
    .query("INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)", [firstname, lastname, email, city, language, hashedPassword])
    .then(([users]) => {
        res.location(`/api/users/${users.insertId}`).sendStatus(201);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the users");
    })

};

const putUser = (req, res) => {
    const id = parseInt(req.params.id);
    const {firstname, lastname, email, city, language} = req.body;

    database
    .query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", [firstname, lastname, email, city, language, id])
    .then(([users]) => {
        if (users.affectedRows === 0) {
        res.status(404).send("Not found");
       } else { 
        res.sendStatus(204);
       }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the users");
    })
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([users]) => {
        if (users.affectedRows === 0) {
        res.status(404).send("Not found");
       } else { 
        res.sendStatus(200);
       }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
    })
}

const getUsersByParams = (req, res) => {
    let sql = "SELECT * FROM users";
    const sqlValues = [];

    if (req.query.language != null) {
        sql += " WHERE language = ?";
        sqlValues.push(req.query.language);

        if(req.query.city != null) {
            sql += " AND city = ?";
            sqlValues.push(req.query.city);
        }
    } else if (req.query.city != null) {
        sql += " WHERE city <= ?";
        sqlValues.push(req.query.city);
    }

    database
    .query(sql, sqlValues)
    .then((result) => {
        const users = result[0]
        res.json(users);
    })
    .catch((err) => { 
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
}

module.exports = {getUsers, getUsersById, postUser, putUser, deleteUser, getUsersByParams, validateUser};