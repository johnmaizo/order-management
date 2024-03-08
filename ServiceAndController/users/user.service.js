const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

module.exports = {
  getAll,
  createUser,
  getByUsername,
  logoutUser,
};

async function getAll() {
  return await db.User.findAll();
}

// TODO: diri ipang balhin ang controller to service para limpyo tan-awon (If possible)
// ? Log-out (WALA NAGAMIT)
async function logoutUser(userId) {
  const user = await getUser(userId);
  return {message: "User logged out successfully"};
}

// ! Finding the Username
async function getByUsername(username) {
  return await db.User.scope("withHash").findOne({where: {username}});
}

//   Other functions
async function createUser(params) {
  // validate
  if (await db.User.findOne({where: {email: params.email}})) {
    throw 'Email "' + params.email + '" is already registered';
  }
  // validate
  if (await db.User.findOne({where: {username: params.username}})) {
    throw 'Username "' + params.username + '" is already taken';
  }

  const user = new db.User(params);

  // has password
  user.passwordHash = await bcrypt.hash(params.password, 10);

  // save user
  await user.save();
}

// helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}
