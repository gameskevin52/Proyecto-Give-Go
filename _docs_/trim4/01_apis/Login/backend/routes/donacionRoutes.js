const express = require("express");
const router = express.Router();

const donacionController = require("../controllers/donacionController");

router.get("/", donacionController.findAll);
router.get("/:id", donacionController.findById);
router.post("/", donacionController.create);
router.put("/:id", donacionController.update);
router.delete("/:id", donacionController.delete);

module.exports = router;