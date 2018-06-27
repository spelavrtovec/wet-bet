/* jshint esversion: 6 */
const express = require("express");
const betRoutes = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Bet = require("../models/Bet");
const session = require("express-session");
const bodyParser   = require('body-parser');


require("dotenv").config();

betRoutes.get("/front-page", (req, res, next) => {
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



betRoutes.post("/day-and-place", (req, res, next) => {
  const date = req.body.date;
  const city = req.body.city;
  const temperature = req.body.temperature;

  const newBet = new Bet({
    temperature
  });

  const newChallenge = new Challenge({
    date,
    city
  });

  newBet.save();

  Challenge
  .findOne({$and: [{"city": city}, {"date": date}] }) //finding the document in challenge collection with the given parameters
  .then( (currentChallenge) => { //using that document -->
    currentChallenge._bets.unshift(newBet) // and putting bets into it, unshifting to the start of the array
    currentChallenge.save() //then actually saving it to the db
  })
  .catch(() => //if findOne does not find a document with the given queries, we just make a new document
  newChallenge.save()
    .then( (currentChallenge) => { //and do the same stuff as above
      currentChallenge._bets.unshift(newBet)
      currentChallenge.save()
    })
  )

  res.redirect(`/betting/${city}/${date}`)
}); //end of post /day and place



//this BETroute takes the user to the "current" bet that he or she just made their own bet on
betRoutes.get("/:city/:date", (req, res) => {
  let city = req.params.city;
  let date = req.params.date;

  Challenge
    .find({$and: [{"city": city}, {"date": date}] })
    .populate("_bets")
    // .populate("_comments")
    .then( challenge => {
      console.log(challenge)
      res.render("betting/day-and-place", { challenge });
    })
});


betRoutes.get("/all-bets", (req, res) => {

  Challenge
    .find()
    .populate("_bets")
    .then( bets => {
      console.log(bets)
      res.render("betting/all-bets", { bets });
    })
});

betRoutes.get("/user", (req, res, next) => {
  const user = req.session.currentUser;

  res.render('betting/user',{user});
});

module.exports = betRoutes;
