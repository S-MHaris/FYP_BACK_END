const express = require("express");

//package to handle database operations
const mongoose = require("mongoose");

const router = express.Router();

//importing the required schemas for respective models
const Affiliate = require("./models/affiliateModel");
const Product = require("./models/productModel");

//creates a new Affiliate offer

router.post("/", (req, res, next) => {
  now = Date.now();

  //initializing expiry by multiplying days with seconds in a day
  exp = Date.now() + req.body.expiry * 86400000;

  temp = new Affiliate({
    _id: new mongoose.Types.ObjectId(),
    owner: req.body.owner,
    product: req.body.product,
    URL: req.body.url,
    targetSales: req.body.targetSales,
    totalSales: req.body.totalSales,
    comission: req.body.comission,
    expiry: exp,
    dateTime: now,
  });
  temp
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Affiliate Offer Created",
        offer: temp,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//updates the affiliate offer that matches the given id

router.patch("/:offerId", (req, res, next) => {
  const id = req.params.offerId;
  const updateOps = {};
  for (const ops of req.body) {
    if (ops.propName === "expiry")
    {
      updateOps[ops.propName] = Date.now() + ops.value * 86400000;
      continue;
    }
    updateOps[ops.propName] = ops.value;
  }
  Affiliate.updateOne({ _id: id }, { $set: updateOps })
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

//returns all the affiliate offers present in database

router.get("/", (req, res, next) => {
  Affiliate.find()
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        affiliates: result,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//returns the affiliate offer that matches the given id

router.get("/:offerId", (req, res, next) => {
  const id = req.params.offerId;
  Affiliate.find({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//filters the affiliate offers on the basis of 
//products that are present in them

router.get("/filter/tags/", (req, res, next) => {
  const filterTags = req.body.tags;

  Product.find({ tags: { $in: filterTags } })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        tempProdIds = [];
        for (x of result) {
          tempProdIds.push(x._id);
        }
        Affiliate.find({ product: { $in: tempProdIds } })
          .exec()
          .then((offers) => {
            res.status(200).json(offers);
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });

      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//delets the offer that matches the respective id

router.delete("/:offerId", (req, res, next) => {
  const id = req.params.offerId;
  Affiliate.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//exports router variable so that is can be used by other files

module.exports = router;
