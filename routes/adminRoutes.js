const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores,
} = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.post("/users", addUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/stores", addStore);
router.get("/stores", getStores);

module.exports = router;
