//This creates Database connection and handle calls from app using databasecall.js
//It also starts Scheduler for mail using mailer.js

var Cookies = require("cookies");
var router = require("express").Router();
var dbcall = require("./databasecall");
var scheduler=require("./mailer");

module.exports =  router;

//Creating database connection
dbcall.connect().then(()=>{
  scheduler.startSchedule();
}).catch(
  (err)=>{
    console.log(err);
  }
);

//Handling Http Client calls
router.post("/getlogin", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var cookies = new Cookies(req, res, { keys: keys });
  //Logn user
  dbcall.loginUser(username, password, res, cookies);
});
router.post("/sendleaves", function(req, res, next) {
  var leaves = req.body.leave;
  var cookies = new Cookies(req, res, { keys: keys });
  var id = cookies.get("uid", { signed: true });
  //Send Leaves
  dbcall.sendLeaves(id, leaves, res);
});
router.post("/timein", function(req, res, next) {
  var time = req.body.time;
  var cookies = new Cookies(req, res, { keys: keys });
  var id = cookies.get("uid", { signed: true });
  //Save time
  dbcall.sendTime(id, time, res);
});


