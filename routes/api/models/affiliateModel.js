const mongoose = require("mongoose");
const Retailer = require("./retailerModel");
const Product = require("./productModel");

//creating a schema of an affiliate offer
const affiliateSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  //Retailer that created the offer
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, //,
    //ref: "Retailer",
  },

  //Product that is placed in the offer
  product: {
      type: mongoose.Schema.Types.ObjectId,
    required: true, //,
    //ref: "Product",
  },

  //URL of the product's buy button
  URL: { type: String, required: true },

  //target Sales of the offer
  targetSales: {type: Number, required: true},

  //total sales to generated uptill now
  totalSales: {type:Number},

  //comission per sale for each generated
  comission: { type: Number, required: true },

  //date at which offer will expire
  expiry: { type: Date, required: true },

  //data at which offer is created
  dateTime: { type: Date, required: true }
});

module.exports = mongoose.model("Affiliate", affiliateSchema);
