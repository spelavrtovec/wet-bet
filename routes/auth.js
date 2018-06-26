const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/User");

require("dotenv").config(); 

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup", {
    errorMessage: ""});
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  // const role = req.body.role;

  //if a field is empty, say this
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Please put in all: your name, e-mail and a password." });
    return;
  }

  //if the username already exists
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "This person is already a registered weather enthusiast." });
      return;
  }

  //this cleans the hash from the slashes.
  function deleteSlashFromString(string) {
    return string
   .split("")
   .filter(elem => elem !== "/")
   .join("");
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const hashConfirmation = deleteSlashFromString(bcrypt.hashSync(username, salt)); //and here we put the hash in, and use the "slash cleaner"-function. When we get the email, we avoid problems with slashes in links

  const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmation: hashConfirmation
      // role: ??
  });

  newUser.save((err) => {
    if (err) {
      console.log(err)
      res.render("auth/signup", { message: "Something went horribly wrong."})
    
    } else { //the transporter thingie
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD
        }
      });

      transporter.sendMail({
        from: `"/" ${process.env.GMAIL_EMAIL}`,
        to: email, 
        subject: "The confirmation e-mail", 
        html: `Click on this link: http://localhost:3000/auth/confirm/${hashConfirmation}`
      })
      console.log(email);
      res.redirect("/");
    }
  });

});
});

authRoutes.get("/confirm/:hashConfirmation", (req, res) => {
  User.findOne({ confirmation: req.params.hashConfirmation })
    .then (user => {
      User.findOneAndUpdate (user._id, { status: "Active"})
      .then (updatedUser => { 
        res.render("auth/login");
      });
    })
    .catch (err => {
      console.log(err);
      res.redirect("/")
    });
});

// authRoutes.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

module.exports = authRoutes;
