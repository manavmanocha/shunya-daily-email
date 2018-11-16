//This creates Database connection and handle calls from app using databasecall.js
//It also starts Scheduler for mail using mailer.js

let Cookies = require("cookies");
let router = require("express").Router();
let dbController = require("./databasecall");
let scheduler = require("./mailer").startSchedule;

module.exports = router;
let keys = ["keyboard cat"];

//Creating database connection
dbController
  .connect()
  .then(() => {
    scheduler();
  })
  .catch(err => {
    console.log(err);
  });

//Handling Http Client calls
router.post("/login", function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let cookies = new Cookies(req, res, { keys: keys });
  //Logn user
  dbController.loginUser(username, password, res, cookies);
});
router.post("/sendleaves", function(req, res, next) {
  let leaves = req.body.leave;
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get("uid", { signed: true });
  //Send Leaves
  dbController.sendLeaves(id, leaves, res);
});
router.post("/timein", function(req, res, next) {
  let time = req.body.time;
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get("uid", { signed: true });
  //Save time
  dbController.sendTime(id, time, res);

});

router.post("/createuser", function(req, res, next) {
  let user = req.body.user;
  user.password = "Compro11";
  dbController.createUser(user, res);
});

router.get("/getusername", function(req, res, next) {
  dbController.getUsers().then(users => {
    usernames = [];
    for (i = 0; i < users.length; i++) {
      usernames.push(users[i].username);
    }
    res.send(usernames);
  });
});

router.post("/removeusers", function(req, res, next) {
  let users = req.body.users;
  let returnobj = [];
  let c=0;
  new Promise(function(resolve, reject) {
    users.forEach(user => {
      dbController.removeUser(user, res).then(result => {
        returnobj.push(result);
        if(returnobj.length==users.length){resolve(true);}
      });
    });
  }).then(()=>{
    console.log(returnobj);
    res.send(returnobj);
  });
});
