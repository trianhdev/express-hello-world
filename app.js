const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const CryptoJS = require("crypto-js")
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
require('dotenv').config()

const _ = require("lodash");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=> console.log("DB connectd"))
    .catch((err)=> {console.log(err);});

const userSchema = mongoose.Schema({
  username:{type:String, require:true},
  password:{type:String, require:true},
  isadmin:{type:Boolean, require:true}
});
const User = mongoose.model("user", userSchema);

const countrySchema=mongoose.Schema({
  countryName:String
})
const Country = mongoose.model("country", countrySchema);

const matchSchema = mongoose.Schema({
  country1:countrySchema,
  country2:countrySchema,
  matchday:Date,
  rate1:Number,
  rate2:Number
})
const Match = mongoose.model("match", matchSchema);

const orderSchema = mongoose.Schema({
  user:userSchema,
  match:matchSchema,
  order1:Number,
  balance1:Number,
  order2:Number,
  balance2:Number,
  balance:Number
})
const Order = mongoose.model("order", orderSchema);

app.get("/signup", function (req, res) {
  res.render("signup");
});
app.post("/signup", function (req, res) {
  const newUser = new User({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
  })
  newUser.save()
});

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/signin",function(req,res){
  try {
    const user = User.findOne({username: req.body.username});
    const pass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8)
    if (pass === req.body.password){
      res.send("login")
    }
  } catch (err) {
    console.log(err)
  }



})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

