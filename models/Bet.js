const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require("../models/User");

const betSchema = new Schema({
  _user: Schema.Types.ObjectId, ref: "User",
  temperature: Number,
  cloudiness: Number, //in %
  humidity: Number, //in %
  pressure: Number //in hPa
});

const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;