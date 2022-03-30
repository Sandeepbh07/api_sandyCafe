const Category = require("../models/category");
const createError = require("http-errors");
const { categorySchema } = require("../validators/schema-validator");
const mongoose = require("mongoose");

exports.fetchAllCategories = async (req, res, next) => {
  try {
    const result = await Category.find({});
    if (result.length === 0) {
      next(createError(404, "No categories found"));
      return;
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const result = await categorySchema.validateAsync(req.body);
    const category = new Category(result);
    category.addedBy = "sandy";
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    if (error.message.includes("E11000")) {
      return next(
        createError.Conflict(`Category name ${req.body.name} already exists`)
      );
    }
    next(createError(error));
  }
};

exports.getCategoryId = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return next(createError(404, "Category not found"));
    }
    req.category = category;
    next();
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Category Id"));
    }
    next(error);
  }
};

exports.getCategory = async (req, res) => {
  return res.status(200).json(req.category);
};
