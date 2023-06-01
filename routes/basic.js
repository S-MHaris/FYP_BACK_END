const express = require('express');
const path = require("path");
const router = express.Router();

//using express to recieve form data
router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {

    //sending variables to the html
    vars = { "title": "LogIn", "Heading": "This is the LogIn Form" };


    //generating a response for url through html with success status 200
    res.status(200).render('login.pug');

})

//
// All the callback functions placed to handle requests for a specifc page 
//

router.post('/', (req, res) => {
    res.status(200).render('login.pug')
})

router.get("/login", (req, res) => {
    res.status(200).render('login.pug')
})

router.get("/signup", (req, res) => {
    res.status(200).render('signup.pug')
})

router.post("/signup", (req, res) => {
    res.status(200).render('signup.pug')
})

router.get("/home", (req, res) => {
    res.status(200).render('home.pug')
})

router.get("/retailer", (req, res) => {
    res.status(200).render('RetailerDashboad.pug')
})

router.get("/influencer", (req, res) => {
    res.status(200).render('InfluencerDashboard.pug')
})


module.exports = router