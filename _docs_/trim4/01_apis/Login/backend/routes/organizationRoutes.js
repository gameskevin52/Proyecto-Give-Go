const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/create", organizationController.register);
router.post("/login", organizationController.login);

router.get("/", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getAllOrganizations);
router.get("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getOrganizationById);
router.put("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion"]), organizationController.getOrganizationUpdate);
router.delete("/delete/:id", verifyToken, authorizeRoles(["Admin"]), organizationController.getOrganizationDelete);

module.exports = router;
