/* jshint esversion: 6 */
const express = require("express");
const betRoutes = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Bet = require("../models/Bet");
const session = require("express-session");
const bodyParser   = require('body-parser');
const weather = require('openweather-apis');
const axios = require("axios")



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

  // console.log("req", req.session.currentUser);
  

  const newBet = new Bet({
    temperature,
    _user: userId,
  });

  const newChallenge = new Challenge({
    date,
    city,
  });



  // first query here finds the current user id. Then we push into that users _bets the newBet_id
  // What happens: above, we have but challenges into the bet instance (just above)
  // then (just under) we put that bet instance in the user collection

  User.findByIdAndUpdate(userId, {$push: { _bets: newBet._id }}, { 'new': true}) 
  .then(user => {
    console.log("user",user);
  })
  .catch(err => console.log("err", err));
  
  // newBet._challenge = newChallenge._id 
  //effectively adding challenges to our Bet instance (just above)
  //but isn't the newChallengeId unique? Only one, and i think this refers to the id of the literally "new challenge"
  //OK, so if it's here saving in the bet only new challenges, I need to later save in bets old challenges
  
  Challenge
  .findOne({$and: [{"city": city}, {"date": date}] }) //finding the document in challenge collection with the given parameters
  .then( (currentChallenge) => { //using that document -->
    currentChallenge._bets.unshift(newBet) // and putting bets into it, unshifting to the start of the array
    newBet._challenge = currentChallenge._id
    currentChallenge.save() //then actually saving it to the db
  })
  .catch(() => //if findOne does not find a document with the given queries, we just make a new document
  
  
  newChallenge.save()
  .then( (currentChallenge) => { //and do the same stuff as above
    currentChallenge._bets.unshift(newBet)
    newBet._challenge = currentChallenge._id
    currentChallenge.save()
  })
).then(() => {//after all database stuff
  newBet.save(); //new bet only saved after currentchallange inserted into it
  

  ///////////////////
  //////// THIS IS GOING TO THE EVALUATION
  ///////////////////
  let makeTodayDate = function() {
    let dateToday = new Date();
    let month = dateToday.getMonth() + 1;
    let day = dateToday.getDate();
    let year = dateToday.getFullYear();
  
    if (month < 10) month = "0" + month.toString();
  
    if (day < 10) day = "0" + day.toString();
  
    let todayDate = year + "-" + month + "-" + day;
    return todayDate; //now returns object - can be used directly in queries
  };
  
  
  function returnWinners () { //cityId is a number-type. 
    let today = makeTodayDate()
    Challenge.find({
        "date": today
      })
      .populate({
        path: '_bets',
        populate: {
          path: '_user',
        }
      })
    .then(todaysBets => {
      for (let i=0; i<todaysBets.length; i++) { //going inside city and date
        // console.log(todaysBets[i])

        let city = todaysBets[i].city;
        let appId = process.env.WEATHER_KEY;
        let weatherQueries = `${city}&units=metric&APPID=${appId}`
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${weatherQueries}`)
        .then(value => {
          let tempNowFromApi = Math.round(value.data.main.temp)
          todaysBets[i]._bets.forEach( (j, index) => {
              // each bet in todaysbets is j, and each of those have a user,
            let tempOfCurrentBet = j.temperature;
            // console.log(`${city} BET`, j.temperature);
            if (tempOfCurrentBet == tempNowFromApi) {
              User.findByIdAndUpdate(j._user._id, {weatherPoints:j._user.weatherPoints+5 }, {new: true})
              .then((value)=>{

                // console.log(value)
                console.log("These are the winning bets:",city ,j._user.username, tempOfCurrentBet, "\n\n")
              })
              
              //we want tempOfCurrentBet and then find it's "owners", and then award those owners with points, and done. 
              //give the user weatherPoints
            }
          });

        })
        .catch(err=>console.log(err));

        //   console.log ("THE CURRENT TEMP IN", todaysBets[i].city,"IS", temp)
        // console.log("BET NUMBER",i, "\n" ,  todaysBets[i]._bets);

      }
      console.log()
      return;
      // console.log("These are todays bets------------","\n\n",todaysBets., "\n")
    });
  } //end of returnWinners

  returnWinners()

  ////////
  //// TO EVALUTION STOPS
  ////////

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
    console.log(user._bets[0])
    res.render('betting/user',{user});
  })
});

module.exports = betRoutes;
