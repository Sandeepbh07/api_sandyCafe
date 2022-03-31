const Dish = require("../models/dish");
const createError = require("http-errors");
const { dishSchema } = require("../validators/schema-validator");
const mongoose = require("mongoose");
const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

exports.createDish = async (req, res, next) => {
  const { name, description, price, category, photo } = req.body;
  let dish;
  try {
    const result = await dishSchema.validateAsync({
      name,
      description,
      price,
      category,
    });
    dish = new Dish({ name, description, price, category });
    dish.addedBy = "sndp";
    savePhoto(dish, photo);
    const newDish = await dish.save();
    newDish.photo = undefined;
    return res.status(201).json(newDish);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    if (error.message.includes("E11000")) {
      return next(createError.Conflict(`The dish ${dish.name} already exists`));
    }
    next(error);
  }
};

exports.fetchDish = async (req, res, next, id) => {
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      throw createError(404, "Dish not found");
    }
    req.dish = dish;
    next();
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Dish ID"));
    }
    next(error);
  }
};

exports.fetchDishById = async (req, res, next) => {
  req.dish.photo = undefined;
  return res.status(200).json(req.dish);
};

exports.fetchDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find()
      .select("-photo")
      .populate("category", "_id,name");
    if (dishes.length === 0) {
      throw createError(400, "No Dishes Found");
    }
    res.status(200).json(dishes);
  } catch (error) {
    next(error);
  }
};

exports.getDishPhoto = async (req, res) => {
  const dish = req.dish;
  if (dish.photo.data) {
    res.set("Content-Type", dish.photo.contentType);
    return res.send(dish.photo.data);
  } else {
    return res.status(204).json({ message: "No data found" });
  }
};

exports.searchByCategory = async (req, res, next) => {
  let { categories } = req.body;

  let criteria = {};
  try {
    if (categories.length === 0) {
      return createError(404, "No categories specified");
    }
    criteria = { category: { $in: categories } };

    const result = await Dish.find(criteria)
      .select("-photo")
      .populate("category", "_id name");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

function savePhoto(dish, photo) {
  if (photo != null && imageTypes.includes(photo.type)) {
    dish.photo.data = new Buffer.from(photo.data, "base64");
    dish.photo.contentType = photo.type;
  }
}
