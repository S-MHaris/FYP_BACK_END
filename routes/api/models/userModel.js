const mongoose = require("mongoose");

//creating a schema of an user id
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, reuired:true , unique:true},
    password: { type: String, required:true },
    userImage: {type: String, required:false, }
});

module.exports = mongoose.model('User', userSchema);
