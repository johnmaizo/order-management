const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const branchService = require("./branch.service");

// ! For authorization
const authenticate = require("_middleware/auth.middleware");

// Routes
router.post("/", authenticate, createSchema, createBranch); // Create a new Branch
router.get("/", authenticate, viewBranches); // View Branches
router.get("/:id", authenticate, getBranchById); // Get Branch by ID
router.put("/:id", authenticate, updateSchema, updateBranch); // Update Branch by ID
router.post("/:branchId/assign/:userId", authenticate, assignUserToBranch); // Assign User to Branch
router.delete("/:id", authenticate, deleteBranch); // Delete Branch by ID

// Update product by ID

module.exports = router;

// Controller functions

// Create a new Branch
async function createBranch(req, res, next) {
  const {role} = req.query;

  try {
    await branchService.createNewBranch(req.body, role);
    res.json({message: "Branch created successfully!!"});
  } catch (error) {
    next(error);
  }
}

// View Branches
async function viewBranches(req, res, next) {
  try {
    const branches = await branchService.viewBranches(req.query);
    res.json(branches);
  } catch (error) {
    next(error);
  }
}

// Get Branch by ID
async function getBranchById(req, res, next) {
  const {role} = req.query;
  try {
    const branch = await branchService.getBranchById(req.params.id, role);
    res.json(branch);
  } catch (error) {
    next(error);
  }
}

// Delete Branch by ID
async function deleteBranch(req, res, next) {
  const {role} = req.query;
  try {
    await branchService.deleteBranch(req.params.id, role);
    res.json({message: "Branch deleted successfully"});
  } catch (error) {
    next(error);
  }
}

// Update Branch by ID
async function updateBranch(req, res, next) {
  const {role} = req.query;
  try {
    await branchService.updateBranch(req.params.id, req.body, role);
    res.json({message: "Branch updated"});
  } catch (error) {
    next(error);
  }
}

// Controller function to assign user to branch
async function assignUserToBranch(req, res, next) {
  const {role} = req.query;

  try {
    const {branchId, userId} = req.params;

    // Call the service function to assign the user to the branch
    await branchService.assignUserToBranch(branchId, userId, role);

    res.json({message: "User assigned to branch successfully"});
  } catch (error) {
    next(error);
  }
}

// Schema for creating a new Branc
function createSchema(req, res, next) {
  const schema = Joi.object({
    branchName: Joi.string().required(), // Name of the branch
    branchLocation: Joi.string().required(), // Description of the branch
    branchDescription: Joi.string().required(), // Description of the branch
    isActive: Joi.boolean().default(true), // Branchs status (default: true)
  });
  validateRequest(req, next, schema);
}

// Schema for updating an Branch
function updateSchema(req, res, next) {
  const schema = Joi.object({
    branchName: Joi.string().empty(""), // Optional: New name of the branch
    branchLocation: Joi.string().empty(""), // Optional: New descriptin of the branch
    branchDescription: Joi.string().empty(""), // Optional: New descriptin of the branch
    isActive: Joi.boolean().empty(""), // Optional: Branchs status
  });
  validateRequest(req, next, schema);
}
