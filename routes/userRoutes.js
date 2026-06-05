const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getStores, submitRating } = require("../controllers/userController");

router.use(protect);

router.get("/stores", getStores);
router.post("/rating", submitRating);

module.exports = router;
