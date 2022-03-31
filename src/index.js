const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();
const categoryRoutes = require("./routes/category");
const dishRoutes = require("./routes/dish");
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
});

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const PREFIX = "/" + process.env.PREFIX;

app.use(PREFIX, categoryRoutes);
app.use(PREFIX, dishRoutes);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world!" });
});

app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`);
  await mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
