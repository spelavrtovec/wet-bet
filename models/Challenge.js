const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Bet = require("../models/Bet");
const Post = require("../models/Post");

const challengeSchema = new Schema({
  date: String,
  city: String,
  _bets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
  _comments: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;