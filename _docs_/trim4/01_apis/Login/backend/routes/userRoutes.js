const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/create", userController.register);
router.post("/login", userController.login);

router.get("/", verifyToken, authorizeRoles(["admin", "organization"]), userController.getAllUsers);
router.get("/:id", verifyToken, authorizeRoles(["admin", "organization", "user"]), userController.getUserById);
router.put("/:id", verifyToken, authorizeRoles(["admin", "organization", "user"]), userController.getUserUpdate);
router.delete("/delete/:id", verifyToken, authorizeRoles(["admin", "organization"]), userController.getUserDelete);

module.exports = router;
