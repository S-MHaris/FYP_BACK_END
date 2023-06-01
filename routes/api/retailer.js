const express = require("express");

//package to handle database operations
const mongoose = require("mongoose");

//package to handle uploaded images 
const multer = require("multer");

//package to encrypt and decrypt the password
const bcrypt = require("bcrypt");

//package to create authorization token
const jwt = require("jsonwebtoken");

//passwrod key for encryption and token creation
const PASS_KEY = "SMHARIS";

const router = express.Router();

//importing required database schema
const Retailer = require("./models/retailerModel");

//initializing location for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//filter for which files are allowed to be uploaded
const fileFiler = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//initializing upload variable for file storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFiler,
});

//login request API that takes email and password 
//and returns auth token if user is present in database

router.post("/login", (req, res, next) => {
  Retailer.find({ email: req.body.email })
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


//signup API takes complete user info to create a user

router.post("/signup",(req, res, next) => {
  
  //encrypting the password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: "Password could not be hashed",
      });
    } else {
      const temp = new Retailer({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
        description: req.body.description,
        address: req.body.address,
        website: req.body.website,
        bankDetails: req.body.bankDetails,
        dateTime: Date.now(),
      });

      temp
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: "Retailer Created",
            user: temp,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err, message: "Retailer not created" });
        });
    }
  });
});

//takes user id and values to update the respective user

//takes user id and values to update the respective user

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  let temp;
  for (const ops of req.body) {

    //condition if password is update to encrypt it during storage
    if (ops.propName === "password") {
      bcrypt.hash(ops.value, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: "Password could not be hashed",
          });
        } else {
          Retailer.updateOne({ _id: id }, { $set: {password:hash} })
            .exec()
            .then((result) => {
              console.log("Password Changed Successfully");
            })
            .catch((err) => {
              console.log("Password could not be updated")
            });
        }
      })
      continue;
    }
    updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps["password"])
  Retailer.updateOne({ _id: id }, { $set: updateOps })
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

//adds a product id in the retailer's product list 

router.patch("/addProduct/:userId", (req, res, next) => {
  const id = req.params.userId;
  Retailer.updateOne(
    { _id: id },
    { $addToSet: { products: req.body.productId } }
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

router.patch("/removeProduct/:userId", (req, res, next) => {
  const id = req.params.userId;
  Retailer.updateOne(
    { _id: id },
    { $pull: { products: req.body.productId } }
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


router.patch("/addAffiliate/:userId", (req, res, next) => {
  const id = req.params.userId;
  Retailer.updateOne(
    { _id: id },
    { $addToSet: { affiliates: req.body.affiliateId } }
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

router.patch("/removeAffiliate/:userId", (req, res, next) => {
  const id = req.params.userId;
  Retailer.updateOne(
    { _id: id },
    { $pull: { affiliates: req.body.affiliateId } }
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

//returns all users present in database

router.get("/", (req, res, next) => {
  console.log(req.body);
  Retailer.find()
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

//returns user if given user id matches any

// router.get("/:userId", (req, res, next) => {
//   const id = req.params.userId;
//   Retailer.find({ _id: id })
//     .exec()
//     .then((doc) => {
//       console.log(doc[0]);
//       res.status(200).json(doc[0]);
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

//deletes the user that matches the id given

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Retailer.remove({ _id: id })
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


//returns user if given user email matches any


// API endpoint to receive email from React
router.get("/email/temp/:email", (req, res, next) => {
  const uEmail = req.params.email;
  Retailer.findOne({ email: uEmail })
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









//exports routes variable so that is can be used by other files

module.exports = router;
