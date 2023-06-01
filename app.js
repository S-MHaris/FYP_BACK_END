//importing modules from express
const express = require("express");



//importing path from os modules to access files
const path = require("path");

//body parser package translates the data recieved along with the http request body
const bodyParser = require("body-parser");

//morgan is a middleware used to display the details of the http requests
const Morgan = require("morgan");

//mongoose is used to handle database operations
const mongoose = require("mongoose");

//initializing express as app variable
const app = express();

//internet connection port
const port = 80;

//providing url and destinaion to access static files
app.use("/static", express.static("static"));

//providing another static location for upload files to be placed such as product-images
app.use("/uploads", express.static("uploads"));

//setting morgan to display "dev" style request details
app.use(Morgan("dev"));

//using body parser package to recieve and post json objects
//extended is false to allow only simple json objects
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


//Cors for cross acess 
const cors=require("cors");
app.use(cors());

//connecting mongodb
//connecting with 'test' database of our mongod server in localMachine(0.0.0.0)
//providing parse type to convert web json to mongodb readable format
mongoose.connect("mongodb://0.0.0.0:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database is connected");
});


app.use((req, res, next) => {
  //configuring which origins can access this API (* which means all)

  res.header("Access-Control-Allow-Origin", "*");

  //configuring which data will be attached to the header of requests

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //configuring which http methods to allow on this API

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

//using pug html template engine to render html files
app.set("view engine", "pug");
//providing destination to look for pug files
app.set("views", path.join(__dirname, "views"));

//routes for webpages
const pageRoutes = require(path.join(__dirname, "/routes/basic.js"));

app.use("/", pageRoutes);
app.use("/signup", pageRoutes);
app.use("/retailer", pageRoutes);
app.use("/influencer", pageRoutes);
app.use("/login", pageRoutes);
app.use("/home", pageRoutes);

//creating routes for different APIs
const userRoutes = require("./routes/api/users");
const retailerRoutes = require("./routes/api/retailer");
const contractRoutes = require("./routes/api/contract");
const productRoutes = require("./routes/api/product");
const influencerRoutes = require("./routes/api/influencer");
const affiliateRoutes = require("./routes/api/affiliate");

//redirecting all related requests to their specifc route
app.use("/users", userRoutes);
app.use("/retailers", retailerRoutes);
app.use("/contracts", contractRoutes);
app.use("/products", productRoutes);
app.use("/influencers", influencerRoutes);
app.use("/affiliates", affiliateRoutes);

//middleware placed to handle any unknown requests
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status(404);
  next(error);
});

//middleware placed to handle errors in requests
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: "request could not be passed",
    },
  });
});

//providing application a port to listen to
//as url is not mentioned default localhost 127.0.0.1 will be used
app.listen(port, () => {
  console.log("Listening to port 80.");
});
