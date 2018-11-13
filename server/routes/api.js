var Cookies = require("cookies");
var express = require("express");
var router = express.Router();
const dbName = "Timesheet";
var db;
const uri =
  "mongodb+srv://User1:1P1Vjy9Bb0tr664Y@cluster0-dwnar.mongodb.net/test?retryWrites=true";

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var ObjectID = require("mongodb").ObjectID;
var keys = ["keyboard cat"];

const loginUser = function(db, username, password, res, cookies) {
  db.collection("authUsers", function(err, collection) {
    assert.equal(null, err);
    let _id, resobj;
    collection.findOne({ username: username }, { password: 1 }, function(err, data) {
      if (err || !data) {
        assert.equal(null, err);
      } else {
        if (password == data.password) {
          _id = data._id;
          resobj = {
            status: true,
            _id: data._id,
            username: username
          };
          console.log(resobj);
          cookies.set("uid", data._id, { signed: true });
        } else {
          resobj = { status: false, _id: null, uemail: null };
        }
        res.send(resobj);
      }
    });
  });
};
router.post("/getlogin", function(req, res, next) {
      var username = req.body.username;
      var password = req.body.password;
      var cookies = new Cookies(req, res, { keys: keys });
      //Display user
      loginUser(db, username, password, res, cookies);
});


MongoClient.connect(
  uri,
  function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    //Change Database
    db = client.db(dbName);
    //Connected to Database
    console.log("Connected to Database");
    
  }
);

module.exports = router;
