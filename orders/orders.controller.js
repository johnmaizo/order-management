const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const orderService = require("./order.service");
const Role = require("../_helpers/role");

// Routes
router.post("/", createSchema, createOrder);
router.get("/", viewOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateSchema, updateOrder);
router.get("/:id/status", getOrderStatus);

module.exports = router;

async function createOrder(req, res, next) {
  try {
    await orderService.createNewProduct(req.body);
    res.json({message: "Order created successfully!!"});
  } catch (error) {
    next(error);
  }
}

async function viewOrders(req, res, next) {
  try {
    const orders = await orderService.viewOrders(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  const {role} = req.query;
  try {
    const order = await orderService.getOrderById(req.params.id, role);

    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const {role} = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({message: "Order updated"});
  } catch (error) {
    next(error);
  }
}

async function getOrderStatus(req, res, next) {
  const {role} = req.query;
  try {
    const orderStatus = await orderService.getOrderStatus(req.params.id, role);
    res.json({orderStatus});
  } catch (error) {
    next(error);
  }
}

// Schemas
function createSchema(req, res, next) {
  const schema = Joi.object({
    productName: Joi.string().required(),
    productQuantity: Joi.number().required(),
    productPrice: Joi.number().required(),
    customerName: Joi.string().required(),
    orderStatus: Joi.number().default(1),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    productName: Joi.string().empty(""),
    customerName: Joi.string().empty(""),
    orderStatus: Joi.number().valid(0, 1, 2, 3, 4, 5).empty(""),
  });
  validateRequest(req, next, schema);
}
