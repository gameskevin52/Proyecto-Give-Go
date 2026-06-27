const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/create", userController.register);
router.post("/login", userController.login);
router.get("/", verifyToken, authorizeRoles(["Admin", "Organizacion"]), userController.getAllUsers);
router.get("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion", "Voluntario", "Beneficiario"]), userController.getUserById);
router.put("/:id", verifyToken, authorizeRoles(["Admin", "Organizacion", "Voluntario"]), userController.getUserUpdate);
router.delete("/delete/:id", verifyToken, authorizeRoles(["Admin", "Organizacion"]), userController.getUserDelete);

module.exports = router;