const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the User model
  const attributes = {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
  };

  // Additional options for the model
  const options = {
    defaultScope: {
      // Exclude password hash by default
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // Include hash with this scope
      withHash: { attributes: {} },
    },
  };

  // Define and return the User model
  const User = sequelize.define("User", attributes, options);

  // Define associations
  User.associate = function (models) {
    // Define a many-to-many relationship with Branches
    User.belongsToMany(models.Branch, { through: 'BranchUser' });
  };

  return User;
}