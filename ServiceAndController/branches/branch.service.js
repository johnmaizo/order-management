const db = require("_helpers/db");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  createNewBranch,
  viewBranches,
  getBranchById,
  updateBranch,
  assignUserToBranch,
  deleteBranch,
};

async function getAll() {
  return await db.Branch.findAll();
}

async function createNewBranch(params, role) {
  authorize(role, [Role.Admin]);

  const branch = new db.Branch(params);

  await branch.save();
}

async function viewBranches({role}) {
  authorize(role, [Role.Admin]);

  const branches = await db.Branch.findAll({
    where: {
      isActive: true,
    },
    attributes: ["id", "branchName"],
  });

  if (branches.length === 0) {
    throw "The Branch is empty. Please add new Branch";
  }

  return branches;
}

async function getBranchById(id, role) {
  authorize(role, [Role.Admin, Role.Customer]);

  // Find Branch by primary key
  const branch = await db.Branch.findByPk(id);
  if (!branch) throw "Branch not found";

  if (branch.isActive === true) {
    return branch;
  } else {
    throw "Branch is Deleted";
  }
}

// ! Delete branch by ID
async function deleteBranch(branchId, role) {
  authorize(role, [Role.Admin]);

  // Find the branch by ID
  const branch = await db.Branch.findByPk(branchId);
  if (!branch) {
    throw "Branch not found";
  }

  // Delete the branch
  return await branch.destroy();
}

async function updateBranch(id, params, role) {
  const branch = await db.Branch.findByPk(id);
  if (!branch) throw "Branch not found";

  authorize(role, [Role.Admin]);
  Object.assign(branch, params);
  await branch.save();
}

// ! Assign User to Branch
async function assignUserToBranch(branchId, userId, role) {
  authorize(role, [Role.Admin]);

  const branch = await db.Branch.findByPk(branchId);
  if (!branch) {
    throw "Branch not found";
  }

  const user = await db.User.findByPk(userId);
  if (!user) {
    throw "User not found";
  }

  // Check if the user is already assigned to the branch
  const isAssigned = await branch.hasUser(user);
  if (isAssigned) {
    throw "User is already assigned to this branch";
  }

  // Assign the user to the branch (Relationship between users and branches)
  await branch.addUser(user);
}

// Helper functions
function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized User";
  }
}
