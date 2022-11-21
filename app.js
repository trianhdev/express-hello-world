const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const CryptoJS = require("crypto-js");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();

const _ = require("lodash");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: "amar",
    saveUninitialized: true,
    resave: true,
  })
);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connectd"))
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  isadmin: {
    type: Boolean,
    require: true,
    default: false,
  },
  balance:{type:Number, default:0}
});
const User = mongoose.model("user", userSchema);

const countrySchema = mongoose.Schema({
  countryName: String,
});
const countryArr = [
  { countryName: "Qatar" },
  { countryName: "Senegal" },
  { countryName: "England" },
  { countryName: "United States" },
  { countryName: "Argentina" },
  { countryName: "Denmark" },
  { countryName: "Mexico" },
  { countryName: "France" },
  { countryName: "Morocco" },
  { countryName: "Germany" },
  { countryName: "Spain" },
  { countryName: "Belgium" },
  { countryName: "Switzerland" },
  { countryName: "Uruguay" },
  { countryName: "Portugal" },
  { countryName: "Brazil" },
  { countryName: "Wales" },
  { countryName: "Netherlands" },
  { countryName: "Tunisia" },
  { countryName: "Poland" },
  { countryName: "Japan" },
  { countryName: "Croatia" },
  { countryName: "Cameroon" },
  { countryName: "Korea Republic" },
  { countryName: "Ecuador" },
  { countryName: "Iran" },
  { countryName: "Australia" },
  { countryName: "Saudi Arabia" },
  { countryName: "Canada" },
  { countryName: "Costa Rica" },
  { countryName: "Ghana" },
  { countryName: "Serbia" },
   
];
const Country = mongoose.model("country", countrySchema);
Country.find({}, function (err, foundList) {
  if (foundList.length == 0) {
    Country.insertMany(countryArr, function (error, docs) {});
  }
});

const matchSchema = mongoose.Schema({
  country1: String,
  country2: String,
  matchtime:String,
  matchday: Date,
  rate1: Number,
  rate2: Number,
});
const matchArr = [ { matchday: "2022-11-20", matchtime: "19:00", country1: "Qatar", country2: "Ecuador", }, { matchday: "2022-11-21", matchtime: "19:00", country1: "Senegal", country2: "Netherlands", }, { matchday: "2022-11-21", matchtime: "16:00", country1: "England", country2: "Iran", }, { matchday: "2022-11-21", matchtime: "22:00", country1: "United States", country2: "Wales", }, { matchday: "2022-11-22", matchtime: "13:00", country1: "Argentina", country2: "Saudi Arabia", }, { matchday: "2022-11-22", matchtime: "16:00", country1: "Denmark", country2: "Tunisia", }, { matchday: "2022-11-22", matchtime: "19:00", country1: "Mexico", country2: "Poland", }, { matchday: "2022-11-22", matchtime: "22:00", country1: "France", country2: "Australia", }, { matchday: "2022-11-23", matchtime: "13:00", country1: "Morocco", country2: "Croatia", }, { matchday: "2022-11-23", matchtime: "16:00", country1: "Germany", country2: "Japan", }, { matchday: "2022-11-23", matchtime: "19:00", country1: "Spain", country2: "Costa Rica", }, { matchday: "2022-11-23", matchtime: "22:00", country1: "Belgium", country2: "Canada", }, { matchday: "2022-11-24", matchtime: "13:00", country1: "Switzerland", country2: "Cameroon", }, { matchday: "2022-11-24", matchtime: "16:00", country1: "Uruguay", country2: "Korea Republic", }, { matchday: "2022-11-24", matchtime: "19:00", country1: "Portugal", country2: "Ghana", }, { matchday: "2022-11-24", matchtime: "22:00", country1: "Brazil", country2: "Serbia", }, { matchday: "2022-11-25", matchtime: "13:00", country1: "Wales", country2: "Iran", }, { matchday: "2022-11-25", matchtime: "16:00", country1: "Qatar", country2: "Senegal", }, { matchday: "2022-11-25", matchtime: "19:00", country1: "Netherlands", country2: "Ecuador", }, { matchday: "2022-11-25", matchtime: "22:00", country1: "England", country2: "United States", }, { matchday: "2022-11-26", matchtime: "13:00", country1: "Tunisia", country2: "Australia", }, { matchday: "2022-11-26", matchtime: "16:00", country1: "Poland", country2: "Saudi Arabia", }, { matchday: "2022-11-26", matchtime: "19:00", country1: "France", country2: "Denmark", }, { matchday: "2022-11-26", matchtime: "22:00", country1: "Argentina", country2: "Mexico", }, { matchday: "2022-11-27", matchtime: "13:00", country1: "Japan", country2: "Costa Rica", }, { matchday: "2022-11-27", matchtime: "16:00", country1: "Belgium", country2: "Morocco", }, { matchday: "2022-11-27", matchtime: "19:00", country1: "Croatia", country2: "Canada", }, { matchday: "2022-11-27", matchtime: "22:00", country1: "Spain", country2: "Germany", }, { matchday: "2022-11-28", matchtime: "13:00", country1: "Cameroon", country2: "Serbia", }, { matchday: "2022-11-28", matchtime: "16:00", country1: "Korea Republic", country2: "Ghana", }, { matchday: "2022-11-28", matchtime: "19:00", country1: "Brazil", country2: "Switzerland", }, { matchday: "2022-11-28", matchtime: "22:00", country1: "Portugal", country2: "Uruguay", }, { matchday: "2022-11-29", matchtime: "18:00", country1: "Ecuador", country2: "Senegal", }, { matchday: "2022-11-29", matchtime: "18:00", country1: "Netherlands", country2: "Qatar", }, { matchday: "2022-11-29", matchtime: "22:00", country1: "Wales", country2: "England", }, { matchday: "2022-11-29", matchtime: "22:00", country1: "Iran", country2: "United States", }, { matchday: "2022-11-30", matchtime: "18:00", country1: "Australia", country2: "Denmark", }, { matchday: "2022-11-30", matchtime: "18:00", country1: "Tunisia", country2: "France", }, { matchday: "2022-11-30", matchtime: "22:00", country1: "Poland", country2: "Argentina", }, { matchday: "2022-11-30", matchtime: "22:00", country1: "Saudi Arabia", country2: "Mexico", }, { matchday: "2022-12-01", matchtime: "18:00", country1: "Croatia", country2: "Belgium", }, { matchday: "2022-12-01", matchtime: "18:00", country1: "Canada", country2: "Morocco", }, { matchday: "2022-12-01", matchtime: "22:00", country1: "Japan", country2: "Spain", }, { matchday: "2022-12-01", matchtime: "22:00", country1: "Costa Rica", country2: "Germany", }, { matchday: "2022-12-02", matchtime: "18:00", country1: "Ghana", country2: "Uruguay", }, { matchday: "2022-12-02", matchtime: "18:00", country1: "Korea Republic", country2: "Portugal", }, { matchday: "2022-12-02", matchtime: "22:00", country1: "Serbia", country2: "Switzerland", }, { matchday: "2022-12-02", matchtime: "22:00", country1: "Cameroon", country2: "Brazil", }, ];
const Match = mongoose.model("match", matchSchema);
Match.find({}, function (err, foundList) {
  if (foundList.length == 0) {
    Match.insertMany(matchArr, function (error, docs) {});
  }
});

const orderSchema = mongoose.Schema({
  userId: String,
  match: String,
  order1: {type:Number,default:0},
  order2: {type:Number,default:0},
},{timestamps:true});
const Order = mongoose.model("order", orderSchema);

app.get("/signup", function (req, res) {
  res.render("signup");
});
app.post("/signup", function (req, res) {
  const newUser = new User({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  newUser.save();
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/signin", function (req, res) {
  try {
    rusername = req.body.username;
    rpassword = req.body.password;
    User.findOne({ username: rusername }, function (err, foundUser) {
      if (!err) {
        password = CryptoJS.AES.decrypt(
          foundUser.password,
          process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);
        if (password === rpassword) {
          req.session.user = foundUser._id;
          console.log("Signin " + req.session.user);
          req.session.save();
          res.redirect("/dashboard");
        } else {
          console.log("error");
          res.redirect("/dashboard");
        }
      } else {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/signout", (req, res) => {
  console.log("Signout " + req.session.user);
  req.session.destroy();
  res.send("Your are logged out ");
});
app.get("/dashboard", function (req, res) {
  Match.find({}, function (err, matchTable) {
    if (!err){
    if (matchTable.length !== 0) {
      userId=req.session.user
      Order.find({userId:userId},function(err,userOrder){    
        console.log(userOrder)    
        res.render("dashboard", {matchTable:matchTable,userId:userId,userOrder:userOrder})
      })
    }}
  });
});
app.post("/order", (req,res)=>{
  matchid=req.body.matchid
  userId=req.body.userId
  
  try {
    const order = new Order({
      userId: req.body.userId,
      match: req.body.matchid,
      order1: req.body.order1,
      order2: req.body.order2,
    })
    order.save()
    
 } catch (e) {
    print (e);
 };

  res.redirect("/dashboard")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
