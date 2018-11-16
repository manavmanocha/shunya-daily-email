let Cookies = require("cookies");
const assert = require("assert");
let ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
let sendmail = require("./mailer").sendmail;
let appConstant = require("./util/app-constant");
//Exports
exports.connect = connect;
exports.loginUser = loginUser;
exports.getTimein = getTimein;
exports.getuserReminder = getuserReminder;
exports.updateTime = updateTime;
exports.updateLeaves = updateLeaves;
exports.sendTime = sendTime;
exports.sendLeaves = sendLeaves;
exports.createUser = createUser;
exports.getUsers= getUsers;
exports.removeUser=removeUser;
let db;
let keys = ["keyboard cat"];

//For Db connection
function connect() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(
      appConstant.uri,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        //Change Database
        db = client.db(appConstant.dbName);
        //Connected to Database
        console.log("Connected to Database");
        resolve(true);
        if (err) {
          reject(err);
        }
      }
    );
  });
}

function loginUser(username, password, res, cookies) {
  db.collection(appConstant.userCollection, function(err, collection) {
    assert.equal(null, err);
    let _id, resobj;
    collection.findOne({ username: username }, { password: 1 }, function(
      err,
      data
    ) {
      if (err || !data) {
        assert.equal(null, err);
        resobj = { status: false, _id: null, uemail: null };
      } else {
        if (password == data.password) {
          _id = data._id;
          resobj = {
            status: true,
            _id: data._id,
            username: username
          };
          cookies.set("uid", data._id, { signed: true });
        } else {
          resobj = { status: false, _id: null, uemail: null };
        }
      }
      res.send(resobj);
    });
  });
}

async function getUsername(id) {
  return new Promise(function(resolve, reject) {
    db.collection(appConstant.userCollection, function(err, collection) {
      assert.equal(null, err);
      collection.findOne({ _id: ObjectID(id) }, function(err, data) {
        if (err || !data) {
          assert.equal(null, err);
          reject(err);
        } else {
          resolve(data.username);
        }
      });
    });
  });
}

async function getTimein() {
  return new Promise(function(resolve, reject) {
    db.collection(appConstant.timeinCollection, function(err, collection) {
      assert.equal(null, err);
      date = new Date();
      stringdate =
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      collection.find({ date: stringdate }).toArray(function(err, data) {
        if (err) {
          assert.equal(null, err);
        } else if (data[0]) {
          resolve(data[0].timein);
        } else {
          resolve({});
        }
      });
    });
  });
}

async function getUsers() {
  return new Promise(function(resolve, reject) {
    db.collection(appConstant.userCollection, function(err, collection) {
      assert.equal(null, err);
      collection.find({}).toArray(function(err, data) {
        if (err || !data) {
          assert.equal(null, err);
        } else {
          resolve(data);
        }
      });
    });
  });
}

async function getuserReminder() {
  return new Promise(function(resolve, reject) {
    getUsers().then(users => {
      getTimein().then(time_d => {
        emails = "";
        for (i = 0; i < users.length; i++) {
          if (!time_d.hasOwnProperty(users[i].username)) {
            emails += users[i].email + ",";
          }
        }
        resolve(emails);
      });
    });
  });
}
function updateTime(user, time, res) {
  // Get the collection
  const collection = db.collection(appConstant.timeinCollection);
  // Insert  user
  try {
    date = new Date();
    stringdate =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    updateobj = "timein." + user;
    collection.updateOne(
      { date: stringdate },
      { $set: { [updateobj]: time } },
      { upsert: true }
    );
    res.send(true);
  } catch (e) {
    console.log("updateTime");
    console.log(e);
    res.send(false);
  }
}

function updateLeaves(user, leave, res) {
  // Get the collection
  const collection = db.collection(appConstant.leavesCollection);
  // Insert  user
  try {
    date = new Date();
    stringdate =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    updateleaveobj = "leaves." + user + ".apply";
    updatestatusobj = "leaves." + user + ".status";
    collection.updateOne(
      { date: stringdate },
      { $set: { [updateleaveobj]: leave, [updatestatusobj]: false } },
      { upsert: true }
    );
    res.send(true);
  } catch (e) {
    res.send(false);
  }
}

function sendTime(id, time, res) {
  getUsername(id).then(username => {
    db.collection(appConstant.timeinCollection, function(err, collection) {
      assert.equal(null, err);
      //updatecollection
      updateTime(username, time, res);
    });
  }).catch((e)=>{
    console.log("sendTime");
    console.log(e);
    res.send(false);
  });
}

function sendLeaves(id, leaves, res) {
  getUsername(id).then(username => {
    db.collection(appConstant.timeinCollection, function(err, collection) {
      assert.equal(null, err);
      //updatecollection
      updateLeaves(username, leaves, res);
    });
  }).catch((e)=>{
    res.send(false);
  });
}

function createUser(user, res) {
  // Get the collection
  const collection = db.collection(appConstant.userCollection);
  // Insert  user
  try {
    collection.findOne({ email: user.email }, function(err, data) {
      if (err) {
        assert.equal(null, err);
        res.send(false);
      } else {
        if (data == null) {
          collection.insertOne(user, function(err, dbresponse) {
            if (err) {
              res.send(false);
            } else {
              usertext = "";
              Object.entries(user).forEach(
                ([key, value]) => (usertext += "<br>" + key + ":" + value)
              );
              sendmail(user.email, "newAccount", usertext);
              res.send(true);
            }
          });
        } else {
          res.send(false);
        }
      }
    });
  } catch (e) {
    res.send(false);
  }
}

function removeUser(user) {
  return new Promise(function(resolve, reject) {
  // Get the collection
  const collection = db.collection(appConstant.userCollection);
  // Insert  user
  try {
    collection.findOne({ username: user }, function(err, data) {
      if (err) {
        assert.equal(null, err);
        resolve({[user]:false});
      } else {
        if (data != null) {
          collection.remove({ username: user }, function(err, dbresponse) {
            if (err) {
              resolve({[user]:false});
            } else {
              sendmail(data.email, "deletion");
              resolve({[user]:true});
            }
          });
        } else {
          resolve({[user]:false});
        }
      }
    });
  } catch (e) {
    resolve({[user]:false});
  }
});
}