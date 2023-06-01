const mongoose = require("mongoose");

//creating a schema of an Retailer
const retailerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  
  //all the products placed by the retailer
  products: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],

  //all the affiliate offers created by the retailer
  affiliates: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],

  bankDetails: {
    bankName: { type: String, required: true },
    bankAccount: { type: String, required: true },
  },
  dateTime: { type: Date, required: true },
});

//exporting the Retailer schema
module.exports = mongoose.model("Retailer", retailerSchema);
