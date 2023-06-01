const mongoose = require("mongoose");
const Retailer = require("./retailerModel");

//creating a schema of a contract

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  //Inflencer that created the contract
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true//,
    //ref: "Influencer",
  },

  //Affiliate offer id
  affiliate: { type: String, required: true },
  
  //Short Monitored URL
  URL: { type: String, required: true },
  
  sales: { type: Number },
  
  //Comission earned through this contract
  comission: { type: Number, required: true },
  
  //Date and time the contract is generated
  dateTime: { type: Date, required: true },
});

module.exports = mongoose.model("Contract", userSchema);
