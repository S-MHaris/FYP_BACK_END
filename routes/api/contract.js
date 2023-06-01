const express = require("express");

//package to handle database operations
const mongoose = require("mongoose");
const router = express.Router();

//importing required contract schema
const Contract = require("./models/contractModel");

//creates a new contract

router.post("/",(req,res,next)=>{
    temp = new Contract({
        _id: new mongoose.Types.ObjectId(),
        owner: req.body.owner,
        affiliate: req.body.affiliate,
        URL: req.body.url,
        sales: 0,
        comission: req.body.comission,
        dateTime: Date.now()
    })
    temp.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Contract Created',
            contract: temp
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

//updates the contract that match given id

router.patch("/:contractId",(req,res,next)=>{
    const id = req.params.contractId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Contract.updateOne({ _id: id }, { $set: updateOps })
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
})


//returns all contracts present in database

router.get("/",(req,res,next)=>{
    Contract.find()
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            contracts: result
        }
        res.status(200).json(response)
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

//returns a single contract that matches the respective id

router.get("/:contractId",(req,res,next)=>{
    const id = req.params.contractId
    Contract.find({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json(result[0])
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

//deletes the contract that matches the given id

router.delete("/:contractId", (req, res, next) => {
  const id = req.params.contractId;
  Contract.remove({ _id: id })
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

//exporting router variable so that it can be used by other files

module.exports = router;