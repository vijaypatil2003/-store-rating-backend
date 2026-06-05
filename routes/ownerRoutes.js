const express = require("express");
const router = express.Router();
const { protect, ownerOnly } = require("../middleware/auth");
const { getDashboard } = require("../controllers/ownerController");

router.use(protect, ownerOnly);
router.get("/dashboard", getDashboard);

module.exports = router;
