const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PASS_KEY="SMHARIS"

const router = express.Router();

const User = require('./models/userModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFiler = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({

    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFiler
})


router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(doc => {
            console.log(doc);
            const response = {
                count: doc.length,
                users: doc
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


router.post('/login', (req,res,next) =>{

    User.find({name: req.body.name})
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(500).json({
                    message: "Auth Failed"
                })
            }
            else{
                bcrypt.compare(req.body.password,user[0].password, (err, result)=>{
                    if (err){
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result){
                        const token = jwt.sign(
                            {
                                name: req.body.name,
                                password: req.body.password
                            },
                            PASS_KEY,
                            {
                                expiresIn: '1h'
                            }
                        )
                        return res.status(200).json({
                            message: "Auth Successful",
                            token: token
                        })
                    }
                    else{
                        return res.status(500).json({
                            message: "Auth Failed"
                        })
                    }
                })
            }
        })
})


router.post('/signup', upload.single('userImage'), (req, res, next) => {
    console.log(req.file);

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: "Password could not be hashed"
            })
        }
        else {
            const temp = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                password: hash,
                userImage: req.file.path
            })

            temp
                .save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: 'User Created',
                        user: temp
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err });
                });
        }

    });

})

router.get('/:userId', (req, res, next) => {
    const name = req.params.userId;
    User.findById(name)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;