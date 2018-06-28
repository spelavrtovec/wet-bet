/* jshint esversion: 6 */
const express           = require("express");
const evaluationRoutes  = express.Router();
const Challenge         = require("../models/Challenge");
const User              = require("../models/User");
const Bet               = require("../models/Bet");
const axios             = require("axios");


require("dotenv").config();



// This route will be called once per day at 5PM
evaluationRoutes.get("/", (req, res, next) => {
  console.log(Challenge.find(_bets));
  
    // For each challenge of the current day
    // Get the current temperature of the city
    // Get all the bets with the good temperature
    // Increment the score of the user 
  res.json({
    nbOfWiningUsers: 0
  })
});

module.exports = evaluationRoutes;
