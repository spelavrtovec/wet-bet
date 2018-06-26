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
    res.render("betting/make-bet", { "message": req.flash("error") });
  });
  

  module.exports = betRoutes;
