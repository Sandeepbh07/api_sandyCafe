const User = require("../models/user");
const createError = require("http-errors");
const { userSchema } = require("../validators/schema-validator");

exports.createUser = async (req, res, next) => {
  let user;
  try {
    const validated = await userSchema.validateAsync(req.body);
    user = new User(validated);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    if (error.message.includes("E11000")) {
      next(
        createError.Conflict(`User with email ${user.email} already exists`)
      );
    }
    return next(createError(error));
  }
};
