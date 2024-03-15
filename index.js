//------------------------------------------------------//
// SBA318 - EXPRESS SERVER APPLICATION                  //
//                                                      //  
// OBJECTIVES:                                          //
//  Create a server application with Node and Express.  //
//  Create a RESTful API using Express.                 //
//  Create Express middleware.                          //
//  Use Express middleware.                             //
//------------------------------------------------------//

const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const users = require("./data/users");
const posts = require("./data/posts");
const books = require("./data/books");

// // DOCS error handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).json({ error: `Resource not found` });
});

// Custom Middleware 1: Logging Middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};


// Custom Middleware 2: Header Middleware
const headerMiddleware = (req, res, next) => {
  res.setHeader("X-Custom-Header", "Custom Value");
  next();
};

// Error-handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
};

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(loggingMiddleware);
app.use(headerMiddleware);


app.get("/", (req, res) => {
  res.send("Work in progress");
});


//------------------------------------------------
// POST DATA CATEGORY
//-------------------------------------------------
//GET all Posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// GET POST by id
app.get("/api/posts/:id", (req, res, next) => {
  try {
    const post = posts.find((p) => p.id == req.params.id);
    if (!post) {
      post.status(404).json({ error: "User not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
});


// GET Posts by category with filtering
app.get("/api/posts/userId/:userId", (req, res) => {
  const { userId } = req.params;
  const { title } = req.query; // Additional filtering by author
  let filteredPosts = posts.filter(post => post.userId === userId);
  if (title) {
    filteredPosts = filteredPosts.filter(post => post.title === title);
  }
  res.json(filteredPosts);
});


//------------------------------------------------
// USER DATA CATEGORY
//-------------------------------------------------

// GET all USERS
app.get("/api/users", (req, res) => {
  res.json(users);
});

// GET USER by id
app.get("/api/users/:id", (req, res, next) => {
  try {
    const user = users.find((u) => u.id == req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
});

// GET all USERS with filtering by name
app.get("/api/users", (req, res) => {
  const { name } = req.query;
  let filteredUsers = users;
  if (name) {
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
  }
  res.json(filteredUsers);
});

// POST USER - create a new user
app.post("/api/users", (req, res) => {
  console.log(req.body); // Log the request body
  if (req.body.name && req.body.username && req.body.email) {
    if (users.find((u) => u.username == req.body.username)) {
      res.json({ error: `Username already taken` });
      return;
    }

    const newUser = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    };

    users.push(newUser);
    res.json(users[users.length - 1]);
  } else {
    console.log(req.body); // Log the request body
    res.json({ error: "Insufficient Data" });
  }
});


//------------------------------------------------
// BOOKS DATA CATEGORY
//-------------------------------------------------

// GET all USERS
app.get("/api/books", (req, res) => {
  res.json(books);
});

// GET BOOKS by id
app.get("/api/books/:id", (req, res, next) => {
  try {
    const book = books.find((u) => u.id == req.params.id);
    if (!book) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
});


// GET books by author/category with filtering
app.get("/api/books/category/:category", (req, res) => {
  const { category } = req.params;
  const { author } = req.query; // Additional filtering by author
  let filteredBooks = books.filter(book => book.category === category);
  if (author) {
    filteredBooks = filteredBooks.filter(book => book.author === author);
  }
  res.json(filteredBooks);
});


// DELETE A BOOK FROM BOOKS COLLECTION
app.delete("/api/books/:id", (req, res) => {
  const book = books.find((u, i) => {
    if (u.id == req.params.id) {
      books.splice(i, 1);
      return true;
    }
  });

  if (book) 
    res.json(book);
  else 
    next();
});


// Error-handling Middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
