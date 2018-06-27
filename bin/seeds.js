const mongoose     = require('mongoose');
const User = require("../models/User");

const databaseName = "big-data";

mongoose.Promise = Promise;
mongoose.connect(`mongodb://localhost/${databaseName}`);

// const bets = [
//   {
//     _user: Schema.Types.ObjectId, ref: "User",
//     temperature: Number,
//     cloudiness: Number, //in %
//     humidity: Number, //in %
//     pressure: Number //in hPa
//   }, 
//   {
//     _user: Schema.Types.ObjectId, ref: "User",
//     temperature: Number,
//     cloudiness: Number, //in %
//     humidity: Number, //in %
//     pressure: Number //in hPa
//   }
// ];

// const challenges = [
//   {
//     day: Date,
//     place: String,
//     _bets: [{ type: Schema.Types.ObjectId, ref: "Bet" }],
//     _posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
//   }
// ];

// const posts = [
//   {
//     _user: Schema.Types.ObjectId, ref: "User",
//     text: String,
//     timestamps: {
//       createdAt: 'created_at',
//       updatedAt: 'updated_at'
//     }
//   },
//   {
//     _user: Schema.Types.ObjectId, ref: "User",
//     text: String,
//     timestamps: {
//       createdAt: 'created_at',
//       updatedAt: 'updated_at'
//     }
//   }
// ];

const users = [
  // {
  //   username: "spelala",
  //   password: "areallynicepass",
  //   email: "spela@vrtovec.net",
  //   status: "Active",
  //   // confirmation: { type: String, unique: true },
  //   timestamps: {
  //     createdAt: 'created_at',
  //     updatedAt: 'updated_at'
  //   },
  //   weatherPoints: 3000
  // },

  {
    username: "larssss",
    password: "passout",
    email: "lars1702@gmail.com",
    status: "Active",
    weatherPoints: 3000,
    // confirmation: { type: String, unique: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  }
];

User.deleteMany()
.then(()=> User.create(users))
.then(usersDocument => {
  console.log(usersDocument)
  console.log(`Create ${users.length} users`)

  mongoose.connection.close()
})
.catch(err => {throw (err)})



