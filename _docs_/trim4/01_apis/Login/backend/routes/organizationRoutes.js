const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/create", organizationController.register);
router.post("/login", organizationController.login);

router.get("/", verifyToken, authorizeRoles(["admin", "organization"]), organizationController.getAllOrganizations);
router.get("/:id", verifyToken, authorizeRoles(["admin", "organization"]), organizationController.getOrganizationById);
router.put("/:id", verifyToken, authorizeRoles(["admin", "organization"]), organizationController.getOrganizationUpdate);
router.delete("/delete/:id", verifyToken, authorizeRoles(["admin"]), organizationController.getOrganizationDelete);

module.exports = router;
