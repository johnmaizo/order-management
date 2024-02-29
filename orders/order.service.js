const db = require("_helpers/db");
const {Op} = require("sequelize");
const Role = require("../_helpers/role");

module.exports = {
  getAll,
  createNewProduct,
  viewOrders,
  getOrderById,
  updateOrder,
  getOrderStatus,
};

async function getAll() {
  return await db.Product.findAll();
}

async function viewOrders({role}) {
  authorize(role, [Role.Admin, Role.Manager]);

  return await db.Product.findAll({
    attributes: ["id", "productName", "customerName"],
  });
}

async function getOrderById(id, role) {
  authorize(role, [Role.Admin, Role.Manager]);

  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  return order;
}

async function getOrderStatus(id, role) {
  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  authorize(role, [Role.Customer]);

  return getStatusMessage(order.orderStatus);
}

async function createNewProduct(params) {
  const product = new db.Product(params);
  await product.save();
}

async function updateOrder(id, params, role) {
  const order = await db.Product.findByPk(id);
  if (!order) throw "Order not found";

  if (isCustomerUpdate(params, role)) {
    Object.assign(order, params);
    await order.save();
  } else {
    authorize(role, [Role.Admin, Role.Manager]);
    Object.assign(order, params);
    await order.save();
  }
}

function getStatusMessage(orderStatus) {
  const statusMessages = {
    0: "Order is Cancelled",
    1: "Placing Order",
    2: "Order Processed",
    3: "Order Shipped",
    4: "Order is out for delivery",
    5: "Order has been Delivered",
  };
  return statusMessages[orderStatus] || "Unknown Status";
}

function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized User";
  }
}

function isCustomerUpdate(params, role) {
  return (
    Object.keys(params).length === 1 &&
    "orderStatus" in params &&
    params.orderStatus === 0 &&
    role.toLowerCase() === Role.Customer.toLowerCase()
  );
}
