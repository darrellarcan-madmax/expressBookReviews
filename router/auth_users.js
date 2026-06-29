const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
    let userswithsameusername = users.filter((user) => user.username === username);
    return userswithsameusername.length > 0;
}

// Check login credentials
const authenticatedUser = (username, password) => {
    let validusers = users.filter(
        (user) => user.username === username && user.password === password
    );
    return validusers.length > 0;
}

// Login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Username or password missing"
        });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            "access",
            {
                expiresIn: 60 * 60
            }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({
            message: "User successfully logged in.",
            token: accessToken
        });

    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password"
    });

});

// Add or modify review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully"
    });

});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (
        books[isbn] &&
        books[isbn].reviews &&
        books[isbn].reviews[username]
    ) {

        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully"
        });

    }

    return res.status(404).json({
        message: "Review not found"
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;