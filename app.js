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
const csvtojson = require("csvtojson");
const fileName = "match.csv";

const _ = require("lodash");
const { query } = require("express");
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
  balance: { type: Number, default: 0 },
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
  matchtime: String,
  matchday: Date,
  rate1: Number,
  rate2: Number,
});

const Match = mongoose.model("match", matchSchema);
csvtojson()
  .fromFile(fileName)
  .then((source) => {
    const matchArr=[];
    // Fetching the data from each row
    // and inserting to the table "sample"
    for (var i = 0; i < source.length; i++) {
      var matchday = source[i]["matchday"],
      matchtime = source[i]["matchtime"],
      country1 = source[i]["country1"],
      country2 = source[i]["country2"];
      rate1 = source[i]["rate1"];
      rate2 = source[i]["rate2"];
      var matchs = {
        matchday:matchday,
        matchtime:matchtime,
        country1:country1,
        country2:country2,
        rate1:rate1,
        rate2:rate1
      };
      matchArr.push(matchs)
    }
    Match.find({}, function (err, foundList) {
      if (foundList.length == 0) {
        Match.insertMany(matchArr, function (error, docs) {});
      }
    });
  });

const orderSchema = mongoose.Schema(
  {
    userId: String,
    match: String,
    order1: { type: Number, default: 0 },
    order2: { type: Number, default: 0 },
  },
  { timestamps: true }
);
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
  res.redirect("dashboard");
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
    if (!err) {
      if (matchTable.length !== 0) {
        userId = req.session.user;
        Order.find({ userId: userId }, function (err, userOrder) {
          if (userOrder.length !== 0) {
            matchTable.forEach(function (match) {
              const uoIndex = userOrder.findIndex((o) => o.match == match._id);
              if (uoIndex >= 0) {
                match._doc.order1 = userOrder[uoIndex]._doc.order1;
                match._doc.order2 = userOrder[uoIndex]._doc.order2;
              }
            });
          }
          res.render("dashboard", { matchTable: matchTable, userId: userId });
        });
      }
    }
  });
});
app.post("/order", (req, res) => {
  const matchid = req.body.matchid;
  const userId = req.body.userId;
  console.log(typeof req.body.order1);
  console.log(typeof req.body.order2);
  try {
    q = {
      match: matchid,
      userId: userId,
    };
    Order.findOne(q, function (err, order) {
      if (!order) {
        const order = new Order({
          match: matchid,
          userId: userId,
          order1: req.body.order1 || 0,
          order2: req.body.order2 || 0,
        });
        order.save();
      } else {
        if (typeof req.body.order2 == "undefined") {
          console.log(
            "update order1 ",
            req.body.order1,
            typeof req.body.order1
          );
          Order.findOneAndUpdate(
            q,
            { order1: req.body.order1 },
            function (err, foundList) {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          console.log("update order2", req.body.order2, typeof req.body.order2);
          Order.findOneAndUpdate(
            q,
            { order2: req.body.order2 },
            function (err, foundList) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        Order.findOne(q, function (err, order) {
          console.log("Order1", order.order1);
          console.log("Order2", order.order2);
        });
      }
    });
  } catch (e) {
    print(e);
  }

  res.redirect("/dashboard");
});

app.listen(port, () =>
  port == 3000
    ? console.log("http://127.0.0.1:3000/")
    : console.log(`app listening on port ${port}!`)
);
