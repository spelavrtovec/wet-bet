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

  let userId = req.session.currentUser._id

  console.log("req", req.session.currentUser);
  

  const newBet = new Bet({
    temperature,
    _user: userId,
  });

  const newChallenge = new Challenge({
    date,
    city,
  });

  newBet._challenge = newChallenge._id

  console.log("THIS IS NEW-BET ID",newBet._id)

  newBet.save();

  User.findByIdAndUpdate(userId, {$push: { _bets: newBet._id }}, { 'new': true}) // first query here finds the current user id. Then we push into that users _bets the newBet_id
  .then(user => {
    console.log("user",user);
  })
  .catch(err => console.log("err", err));
  
  
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
).then(() => {

  res.redirect(`/betting/${city}/${date}`); //put the redirect inside this otherwise empty then just to make sure it only executed after everything else was finished. Otherwise there were probs with newest bet not showing.
});

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
      // console.log(challenge)
      res.render("betting/day-and-place", { challenge });
    })
});


betRoutes.get("/all-bets", (req, res) => {

  Challenge
    .find()
    .populate("_bets")
    .then( bets => {
      // console.log(bets)
      res.render("betting/all-bets", { bets });
    })
});

betRoutes.get("/user", (req, res, next) => {
  User.findById(req.session.currentUser._id)
  .populate({
    path:     '_bets',			
    populate: {
      path:  '_challenge',
    }
  })
  .then(user => {
    res.render('betting/user',{user});
  })
});

module.exports = betRoutes;
