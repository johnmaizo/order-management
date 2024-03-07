// Importing required modules
const db = require("_helpers/db");
const { Op } = require("sequelize");
const Role = require("../_helpers/role");

// Exporting functions for external use
module.exports = {
    getAll,
    updateInventory
};

// Function: getAll - Retrieves all products based on the provided options, authorized for certain roles
async function getAll({ role }, options) {
    authorize(role, [Role.Admin, Role.Manager]);
    return await db.Product.findAll(options);
}

// Function: updateInventory - Updates the quantity of a product, authorized for certain roles
async function updateInventory(productId, newStock, { role }) {
    // Retrieve the product by its ID
    const product = await db.Product.findByPk(productId);

    // Check if the product exists
    if (!product) {
        throw new Error("Product not found");
    }

    // Update the quantity of the product
    product.stock = newStock;

    // Authorize the user based on their role
    authorize(role, [Role.Admin, Role.Manager]);

    // Save the updated product
    await product.save();
}

// Function: authorize - Checks if the user's role is authorized based on allowed roles
function authorize(role, allowedRoles) {
    // If the role is not provided or is not in the allowed roles, throw an unauthorized error
    if (!role || !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())) {
        throw "Unauthorized user";
    }
}
