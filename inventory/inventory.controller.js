// Importing required modules
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const productService = require('./inventory.service');

// Exporting the router
module.exports = router;

// Route: GET '/'
// Function: getAll - Handles the GET request to retrieve all products
router.get('/', getAll);

// Route: POST '/'
// Middleware: validateUpdateInventoryRequest - Validates the request body for updating inventory
// Function: updateInventory - Handles the POST request to update inventory
router.post('/', validateUpdateInventoryRequest, updateInventory);

// Function: getAll - Retrieves all products from the service and sends a JSON response
async function getAll(req, res, next) {
    try {
        const products = await productService.getAll(req.query, {
            attributes: ["id", "productname", "productcategory", "stock"]
        });

        res.json(products);
    } catch (error) {
        next(error);
    }
}

// Function: updateInventory - Updates the inventory based on the request body
async function updateInventory(req, res, next) {
    try {
        const { id, stock } = req.body;

        // Validate request body
        if (!id) {
            return res.status(400).json({ message: "id and stock are required" });
        }

        // Update inventory
        await productService.updateInventory(id, stock, req.query);

        res.json({ message: "Inventory updated successfully" });
    } catch (error) {
        next(error);
    }
}

// Function: validateUpdateInventoryRequest - Validates the request body using Joi schema
function validateUpdateInventoryRequest(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        quantity: Joi.number().min(0).required()
    });

    validateRequest(req, next, schema);
}
