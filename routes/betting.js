/* jshint esversion: 6 */

const express = require("express");
const passport = require('passport');
const betRoutes = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/User");
const session    = require("express-session");



require("dotenv").config(); 



betRoutes.get("/front-page", (req, res, next) => {
    console.log(req.session.currentUser._id);
    if(!req.session.currentUser){
        res.redirect("/")
    }
    res.render("betting/front-page", { "message": req.flash("error") });
  });
  
betRoutes.get("/make-bet", (req, res, next) => {

    var makeMaxDate = function() {

      var dateToday = new Date();
      var month = dateToday.getMonth() + 1;
      var day = dateToday.getDate() + 1;
      var year = dateToday.getFullYear();
    
      if (month < 10)
          month = '0' + month.toString();
    
      if (day < 10)
          day = '0' + day.toString();
      
      var maxDate = year + '-' + month + '-' + day;
      return maxDate;
    };
    
    let date = makeMaxDate();

    res.render("betting/make-bet", {date});
  });

  module.exports = betRoutes;
