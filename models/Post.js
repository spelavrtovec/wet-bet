const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require("../models/User");

const postSchema = new Schema({
  _user: Schema.Types.ObjectId, ref: "User",
  text: String,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;