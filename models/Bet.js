const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require("../models/User");

  const betSchema = new Schema({
    _user: {type: Schema.Types.ObjectId, ref: "User" },
    temperature: Number,
    cloudiness: Number, //in %
    humidity: Number, //in %
    pressure: Number, //in hPa
    weatherPoints: Number,
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }  
  }

);

const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;