/* jshint esversion: 6 */
const express = require("express");
const passport = require("passport");
const betRoutes = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Bet = require("../models/Bet");
const session = require("express-session");
const bodyParser   = require('body-parser');

require("dotenv").config();

betRoutes.get("/front-page", (req, res, next) => {
  console.log(req.session.currentUser._id);
  if (!req.session.currentUser) {
    res.redirect("/");
  }
  res.render("betting/front-page", { message: req.flash("error") });
});

betRoutes.get("/make-bet", (req, res, next) => {
  var makeMaxDate = function() {
    var dateToday = new Date();
    var month = dateToday.getMonth() + 1;
    var day = dateToday.getDate() + 1;
    var year = dateToday.getFullYear();

    if (month < 10) month = "0" + month.toString();

    if (day < 10) day = "0" + day.toString();

    var maxDate = year + "-" + month + "-" + day;
    return maxDate;
  };

  let date = makeMaxDate();

  res.render("betting/make-bet", { date });
});

betRoutes.get("/day-and-place", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/");
  }
  res.render("betting/day-and-place", { message: req.flash("error") });
});


betRoutes.post("/day-and-place", (req, res, next) => {
  const date = req.body.date;
  const city = req.body.city;
  // var city = e.options[e.selectedIndex].text;
  // const city = .options[cityElem.selectedIndex].value;
  // const city = req.body.cityInput;
  const temperature = req.body.temperature;
  console.log(city)


  const newBet = new Bet({
    date,
    city,
    temperature
  });
  newBet.save();
  res.redirect("day-and-place");
}); //end of post /day and place


module.exports = betRoutes;
