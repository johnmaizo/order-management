const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Product model
  const attributes = {
    productName: { type: DataTypes.STRING, allowNull: false }, // Name of the product
<<<<<<< HEAD
    productStock: { type: DataTypes.INTEGER, allowNull: false }, // Quantity of the product
    productPrice: { type: DataTypes.INTEGER, allowNull: false }, // Price of the product
    ProductDetails: { type: DataTypes.STRING, allowNull: false }, // Name of the customer who placed the order
    IsActive: { type: DataTypes.BOOLEAN, allowNull: false }, // Status of the order
  };
=======
    productPrice: { type: DataTypes.INTEGER, allowNull: false }, // Price of the product
    productDescription: { type: DataTypes.STRING, allowNull: false }, // Description of the product
    productStocks: { type: DataTypes.INTEGER, allowNull: false }, // Quantity of the product
    isActive: { type: DataTypes.BOOLEAN, allowNull: false },
};
>>>>>>> 4260d3a378c74f9a85f2f8a5ac60dbe99cca13d4

  // Additional options for the model
  const options = {};

  // Define and return the Product model
  return sequelize.define("Product", attributes, options);
}