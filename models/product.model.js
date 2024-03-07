const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Product model
  const attributes = {
    productName: { type: DataTypes.STRING, allowNull: false }, // Name of the product
    productStock: { type: DataTypes.INTEGER, allowNull: false }, // Quantity of the product
    productPrice: { type: DataTypes.INTEGER, allowNull: false }, // Price of the product
    ProductDetails: { type: DataTypes.STRING, allowNull: false }, // Name of the customer who placed the order
    IsActive: { type: DataTypes.BOOLEAN, allowNull: false }, // Status of the order
  };

  // Additional options for the model
  const options = {};

  // Define and return the Product model
  return sequelize.define("Product", attributes, options);
}