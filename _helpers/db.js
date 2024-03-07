process.env.TZ = "Asia/Manila";

const config = require("config.json");
const mysql = require("mysql2/promise");
const {Sequelize} = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const {host, port, user, password, database} = config.database;
  const connection = await mysql.createConnection({host, port, user, password});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {dialect: "mysql"});

  // init models and add them to the exported db object
  db.Order = require("../models/order.model")(sequelize);
  db.Product = require("../models/product.model")(sequelize);
  db.Inventory = require("../models/inventory.model")(sequelize);
  db.User = require("../models/user.model")(sequelize);
  db.Branch = require("../models/branch.model")(sequelize);

  // Define associations
  const models = Object.keys(db);
  models.forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // sync all models with database
  await sequelize.sync({alter: true});
}
