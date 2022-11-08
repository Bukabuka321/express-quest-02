const database = require("./database");

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
    const {firstname, lastname, email, city, language} = req.body;
    database
    .query("INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, email, city, language])
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

module.exports = {getUsers, getUsersById, postUser, putUser};