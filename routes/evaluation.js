/* jshint esversion: 6 */
const express           = require("express");
const evaluationRoutes  = express.Router();
const Challenge         = require("../models/Challenge");
const User              = require("../models/User");
const Bet               = require("../models/Bet");
const axios             = require("axios");
const weather           = require('openweather-apis');


require("dotenv").config();

weather.setAPPID(process.env.WEATHER_KEY);

let makeTodayDate = function() {
  let dateToday = new Date();
  let month = dateToday.getMonth() + 1;
  let day = dateToday.getDate();
  let year = dateToday.getFullYear();

  if (month < 10) month = "0" + month.toString();

  if (day < 10) day = "0" + day.toString();

  let todayDate = year + "-" + month + "-" + day;
  return {date: todayDate}; //now returns object - can be used directly in queries
};

//hope to return 
function returnWinners (cityId) { //cityId is a number-type. 
  weather.setLang('en');
  weather.setUnits('metric');
  Challenge.find(makeTodayDate()) //can i pass the return of a function in a find?
  .then(todaysBets => {
    console.log("These are todays bets------------",todaysBets);
    // todaysBets.forEach(axios.get
    // weather.setCityId(cityId);  //find id from challenges after all bets are found
    // )
  });

}

// This route will be called once per day at 5PM
evaluationRoutes.get("/", (req, res, next) => {
  console.log(Challenge.find(_bets));
  returnWinners()
  res.json({
    nbOfWinningUsers: 0
  })
});

module.exports = evaluationRoutes;
