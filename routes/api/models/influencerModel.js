const mongoose = require("mongoose");

//creating a schema of an influencer
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    //total comission earned by an influencer
    comission: { type: Number },

    //social media links for the influencer
    socials: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        tiktok: { type: String }
    },
    bankDetails: {
        bankName: { type: String, required: true },
        bankAccount: { type: String, required: true }
    },

    //contracts id formed by the influencer
    contracts: [{
        type: mongoose.Schema.Types.ObjectId//,ref: 'Contract'
    }],

    dateTime: { type: Date, required: true }
});


//exporting the Influencer schema
module.exports = mongoose.model('Influencer', userSchema);