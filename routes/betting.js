const express = require("express");
const passport = require('passport');
const betRoutes = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/User");

require("dotenv").config(); 



betRoutes.get("/front-page", (req, res, next) => {
    res.render("betting/front-page", { "message": req.flash("error") });
  });
  
  betRoutes.get("/make-bet", (req, res, next) => {
    res.render("betting/make-bet", { "message": req.flash("error") });
  });
  

  module.exports = betRoutes;
