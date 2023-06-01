const express = require("express");




//package to handle database operations
const mongoose = require("mongoose");

//package to handle image uploads
const multer = require("multer");

//package to encrypt and decrpt passwords
const bcrypt = require("bcrypt");

//password to create authorization tokens
const jwt = require("jsonwebtoken");

//key to encrypt password and token
const PASS_KEY = "SMHARIS";

const router = express.Router();

//importing the required Influencer Schema
const Influencer = require("./models/influencerModel");

//initilizing the storage location for files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//creting filter for files types that can be uploaded
const fileFiler = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//initializing upload variable
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFiler,
});

//checks if email and password are valid and returns an authorization token

router.post("/login", (req, res, next) => {
  Influencer.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(500).json({
          message: "Auth Failed",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: req.body.email,
                password: req.body.password,
              },
              PASS_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              message: "Auth Successful",
              token: token,
            });
          } else {
            return res.status(500).json({
              message: "Auth Failed",
            });
          }
        });
      }
    });
});

//takes complete influencer info and creates a new influencer

router.post("/signup",(req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: "Password could not be hashed",
      });
    } else {
      const temp = new Influencer({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
        comission: req.body.comission,
        socials: req.body.socials,
        bankDetails: req.body.bankDetails,
        dateTime: Date.now(),
      });

      temp
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: "Influencer Created",
            user: temp,
          });
        
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ error: err, message: "Influencer not created" });

          
        });
    }
  });
});

//update the influencer that matches given id

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {

    //check that encrypts the password if updated
    if (ops.propName === "password") {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: "Password could not be hashed",
          });
        } else {
          updateOps[ops.propName] = hash;
        }
      });
      continue;
    }
    updateOps[ops.propName] = ops.value;
  }
  Influencer.updateOne({ _id: id }, { $set: updateOps })
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

//adds new contract in the ingluencer's contract list

router.patch("/addContract/:userId", (req, res, next) => {
  const id = req.params.userId;
  Influencer.updateOne(
    { _id: id },
    { $addToSet: { contracts: req.body.contractId } }
  )
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

router.patch("/removeContract/:userId", (req, res, next) => {
  const id = req.params.userId;
  Influencer.updateOne(
    { _id: id },
    { $pull: { contracts: req.body.contractId } }
  )
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

//returns all the influencers present in the database

router.get("/", (req, res, next) => {
  console.log(req.body);
  Influencer.find()
    .exec()
    .then((doc) => {
      console.log(doc);
      const response = {
        count: doc.length,
        users: doc,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//returns the single influencer that matches the given id

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Influencer.find({ _id: id })
    .exec()
    .then((doc) => {
      console.log(doc[0]);
      res.status(200).json(doc[0]);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//deletes the influencer that matches the given id

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Influencer.remove({ _id: id })
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});



router.get("/temp/:userEmail", (req, res, next) => {
  const id = req.params.userEmail;

  Influencer.findOne({ email: id })
    .exec()
    .then((doc) => {
      if (doc) {
        // Email found
        console.log(doc);
        res.status(200).json({ message: 'Email found', email: doc });
      } else {
        // Email not found
        res.status(404).json({ message: 'Email not found', email:""});
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

//returns the single influencer that matches the given email









//exports the router variable so other files can use it

module.exports = router;
