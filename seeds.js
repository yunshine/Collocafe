var mongoose = require("mongoose");
var Cafe = require("./models/cafe");
var Comment = require("./models/comment");
var User = require("./models/user");

var data = [
  {
    name: "Cafe Kitsune",
    area: "Aoyama",
    images: [
      {
        url: 'https://res.cloudinary.com/deyqjsowe/image/upload/v1604643015/Collocafe/otrrvzwf6i6v6oq3u0k3.jpg',
        filename: 'Collocafe/otrrvzwf6i6v6oq3u0k3'
      }
    ],
    author: { username: 'Yun' },
    comments: [],
  },
  {
    name: "Trichromatic Coffee",
    area: "Nakano-Shimbashi Station",
    images: [
      {
        url: 'https://res.cloudinary.com/deyqjsowe/image/upload/v1604643015/Collocafe/otrrvzwf6i6v6oq3u0k3.jpg',
        filename: 'Collocafe/otrrvzwf6i6v6oq3u0k3'
      }
    ],
    author: { username: 'Yun' },
    comments: [],
  },
  {
    name: "Cloud's Rest",
    area: "Lorem ipsum",
    images: [
      {
        url: 'https://res.cloudinary.com/deyqjsowe/image/upload/v1604643015/Collocafe/otrrvzwf6i6v6oq3u0k3.jpg',
        filename: 'Collocafe/otrrvzwf6i6v6oq3u0k3'
      }
    ],
    author: { username: 'Yun' },
    comments: [],
  },
  {
    name: "Desert Mesa",
    area: "L ipsum dolor sit",
    images: [
      {
        url: 'https://res.cloudinary.com/deyqjsowe/image/upload/v1604643015/Collocafe/otrrvzwf6i6v6oq3u0k3.jpg',
        filename: 'Collocafe/otrrvzwf6i6v6oq3u0k3'
      }
    ],
    author: { username: 'Yun' },
    comments: [],
  },
  {
    name: "Canyon Floor",
    area: "Lo ipsum dolor sit amet",
    images: [
      {
        url: 'https://res.cloudinary.com/deyqjsowe/image/upload/v1604643015/Collocafe/otrrvzwf6i6v6oq3u0k3.jpg',
        filename: 'Collocafe/otrrvzwf6i6v6oq3u0k3'
      }
    ],
    author: { username: 'Yun' },
    comments: [],
  }
]

function seedDB() {
  //Removes/Deletes all cafes
  Comment.deleteMany({}, function (err) { });
  User.deleteMany({}, function (err) { });
  Cafe.deleteMany({}, function (err) {
    // if (err) {
    //   console.log(err);
    // }
    // console.log("removed cafes!");
    // //Removes/Deletes all ccmments
    // Comment.deleteMany({}, function (err) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("removed comments!");
    //   //add a few cafes
    //   data.forEach(function (seed) {
    //     Cafe.create(seed, function (err, cafe) {
    //       if (err) {
    //         console.log(err)
    //       } else {
    //         console.log("added a cafe");
    //         //create a comment
    //         Comment.create(
    //           {
    //             text: "This place is great, but I wish there was internet",
    //             author: "Yun"
    //           }, function (err, comment) {
    //             if (err) {
    //               console.log(err);
    //             } else {
    //               cafe.comments.push(comment);
    //               cafe.save();
    //               console.log("Created new comment");
    //             }
    //           });
    //       }
    //     });
    //   });
    // });
  });
  //add a few comments
}

module.exports = seedDB;
