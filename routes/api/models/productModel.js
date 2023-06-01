const mongoose = require("mongoose");

//creating a schema of an user id
const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, unique: true, required: true },
  price: { type: Number, required:true },
  description: { type: String, required:true },
  
  //tags that describe the product
  tags: [
    {
      type: String,
    }
  ],

  //images uploaded by the retailer
  images: [
    {
      type: String,
    }
  ],
  dateTime: { type: Date },
});

module.exports = mongoose.model("Product", productSchema);
