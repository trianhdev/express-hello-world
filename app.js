const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

const _ = require("lodash");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose
//     .connect(process.env.MONGO_URL)
//     .then(()=> console.log("DB connectd"))
//     .catch((err)=> {console.log(err);});


app.get("/", function (req, res) {
  res.render("home");
});

app.post("/",function(req,res){
  console.log(req.body.email)
  console.log(req.body.password)
  res.send("log in?")
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

