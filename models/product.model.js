const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    productName: { type: DataTypes.STRING, allowNull: false },
    productQuantity: { type: DataTypes.INTEGER, allowNull: false },
    productPrice: { type: DataTypes.INTEGER, allowNull: false },
    customerName: { type: DataTypes.STRING, allowNull: false },
    orderStatus: { type: DataTypes.INTEGER, allowNull: false },
  };

  const options = {};


  return sequelize.define("Product", attributes, options);
}
