const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Bet = require("../models/Bet");
const Post = require("../models/Post");

const dayNplaceSchema = new Schema({
  day: Date,
  place: String,
  _bets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
  _posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const DayNplace = mongoose.model('DayNplace', dayNplaceSchema);
module.exports = DayNplace;