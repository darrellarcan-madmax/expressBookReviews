const express = require('express');
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

module.exports.general = public_users;