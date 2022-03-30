const express = require("express");

const router = express.Router();
const {
  createDish,
  fetchDishById,
  fetchDish,
  fetchDishes,
  getDishPhoto,
} = require("../controllers/dish");

router.post("/dishes", createDish);
router.get("/dishes", fetchDishes);
router.param("id", fetchDish);
router.get("/dishes/:id", fetchDishById);
router.get("/dishes/:id/photo", getDishPhoto);

module.exports = router;
