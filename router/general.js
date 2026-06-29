const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Unable to register user."
        });
    }

    if (!isValid(username)) {

        users.push({
            username: username,
            password: password
        });

        return res.status(200).json({
            message: "User successfully registered. Now you can login."
        });

    }

    return res.status(404).json({
        message: "User already exists!"
    });

});

// Get all books
public_users.get('/', function (req, res) {

    return res.status(200).json(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});

// Get book details based on Author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const filteredBooks = Object.keys(books)
        .filter(isbn => books[isbn].author === author)
        .reduce((result, isbn) => {
            result[isbn] = books[isbn];
            return result;
        }, {});

    return res.status(200).json(filteredBooks);

});

// Get book details based on Title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const filteredBooks = Object.keys(books)
        .filter(isbn => books[isbn].title === title)
        .reduce((result, isbn) => {
            result[isbn] = books[isbn];
            return result;
        }, {});

    return res.status(200).json(filteredBooks);

});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});
// Task 11 - Get all books using Promise callback
public_users.get("/promise/books", function (req, res) {

    axios.get("http://localhost:5000/")
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            return res.status(500).json({
                message: err.message
            });
        });

});

// Task 11 - Get book by ISBN using Async/Await
public_users.get("/promise/isbn/:isbn", async function (req, res) {

    try {

        const response = await axios.get(
            `http://localhost:5000/isbn/${req.params.isbn}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});

// Task 11 - Get books by Author using Async/Await
public_users.get("/promise/author/:author", async function (req, res) {

    try {

        const response = await axios.get(
            `http://localhost:5000/author/${req.params.author}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});

// Task 11 - Get books by Title using Async/Await
public_users.get("/promise/title/:title", async function (req, res) {

    try {

        const response = await axios.get(
            `http://localhost:5000/title/${req.params.title}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});
module.exports.general = public_users;