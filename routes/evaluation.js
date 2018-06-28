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

}









// This route will be called once per day at 5PM
evaluationRoutes.get("/", (req, res, next) => {
  console.log(Challenge.find(_bets));
  returnWinners()
  res.render("user")
});

module.exports = evaluationRoutes;
