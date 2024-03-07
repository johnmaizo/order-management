const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const userService = require("./user.service");
const bcrypt = require("bcryptjs");

// routes

router.post("/create", createSchema, createUser);
router.post("/login", loginSchema, login);
router.post("/logout", logoutUser);

module.exports = router;

// route functions

// Logout user
async function logoutUser(req, res, next) {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.status(400).json({message: "You are not logged in."});
  }

  try {
    // Clear the session data
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.json({message: "User logged out successfully"});
    });
  } catch (error) {
    next(error);
  }
}

// ! Log-in
async function login(req, res, next) {
  // Check if the user is already logged in
  if (req.session.user) {
    return res.status(400).json({
      message:
        "You are already logged in. Please log out before logging in again.",
    });
  }

  const {username, password} = req.body;

  try {
    const user = await userService.getByUsername(username);

    if (!user) {
      return res.status(401).json({message: "Invalid username"});
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({message: "Invalid password, please try again."});
    }

    // If using sessions, create a new session for the user
    req.session.user = {id: user.id, username: user.username}; // Add any user data you want to store in the session
    // You can also set other session properties as needed

    // Respond with a success message or any additional data you want to return
    res.json({message: "You're successfully logged in!"});
  } catch (error) {
    next(error);
  }
}

function createUser(req, res, next) {
  userService
    .createUser(req.body)
    .then(() => res.json({message: "User created"}))
    .catch(next);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}
