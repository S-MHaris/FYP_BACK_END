const express = require("express");

//package that handles the database operations
const mongoose = require("mongoose");

//package to handle images upload
const multer = require("multer");

const router = express.Router();

//importing required product schema
const Product = require("./models/productModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFiler = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFiler,
});

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((result) => {
      console.log(result);
      const response = {
        count: result.length,
        products: result,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:prodId", (req, res, next) => {
  const id = req.params.prodId;
  Product.find({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/filter/tags/", (req, res, next) => {

  const filterTags = req.body.tags;
  Product.find({ tags: {$in:filterTags}})
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});



router.post("/", (req, res, next) => {

  const tempImages=[];
  const temp = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    tags: req.body.tags,
    images: tempImages,
    dateTime: Date.now(),
  });
  temp
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product Created",
        productId: temp._id, // Return the created product ID
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});



router.patch("/:prodId", (req, res, next) => {
  const id = req.params.prodId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:prodId", (req, res, next) => {
  const pId = req.params.prodId;
  Product.remove({ _id: pId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
