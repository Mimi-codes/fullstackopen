const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

//gets and creates all requests made to the file/router path
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);

  if (user) {
    response.json(user.toJSON());
  } else {
    response.status(404).end();
  }
});

//creates new request if it certifies the username.length and password.length conditions but if otherwise, an error occurs
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!(username && password)) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: "username and password must be at least 3 characters long",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  const saltRounds = 10;
  //// password hash is the output of a one-way hash function applied to the user's password.
   //the hash of the password generated by bcrypt.hash function
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;