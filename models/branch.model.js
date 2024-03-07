const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Branch model
  const attributes = {
    branchName: { type: DataTypes.STRING, allowNull: false },
    branchLocation: { type: DataTypes.STRING, allowNull: false },
    branchDescription: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false },
  };

  // Additional options for the model
  const options = {};

  // Define and return the Branch model
  const Branch = sequelize.define("Branch", attributes, options);

  // Define associations
  Branch.associate = function (models) {
    // Define a many-to-many relationship with Users
    Branch.belongsToMany(models.User, { through: 'BranchUser' });
  };

  return Branch;
}