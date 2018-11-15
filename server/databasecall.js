var Cookies = require("cookies");
const assert = require("assert");
var ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

//Exports
exports.connect = connect,
exports.loginUser = loginUser,
exports.getTimein = getTimein,
exports.getuserReminder = getuserReminder,
exports.updateTime = updateTime,
exports.updateLeaves = updateLeaves,
exports.sendTime = sendTime,
exports.sendLeaves = sendLeaves

const dbName = "Timesheet";
var db;
const uri =
  "mongodb+srv://User1:1P1Vjy9Bb0tr664Y@cluster0-dwnar.mongodb.net/test?retryWrites=true";
var keys = ["keyboard cat"];

//For Db connection
 function connect() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(
      uri,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        //Change Database
        db = client.db(dbName);
        //Connected to Database
        console.log("Connected to Database");
        resolve(true);
        if (err){
            reject(err);
        }
      }
    );
  });
};

function loginUser (username, password, res, cookies) {
  db.collection("authUsers", function(err, collection) {
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
          console.log(resobj);
          cookies.set("uid", data._id, { signed: true });
        } else {
          resobj = { status: false, _id: null, uemail: null };
        }
      }
      res.send(resobj);
    });
  });
};

async function getUsername(id) {
  return new Promise(function(resolve, reject) {
    db.collection("authUsers", function(err, collection) {
      assert.equal(null, err);
      collection.findOne({ _id: ObjectID(id) }, function(err, data) {
        if (err || !data) {
          assert.equal(null, err);
        } else {
          console.log("data");
          console.log(data);
          resolve(data.username);
        }
      });
    });
  });
}

async function getTimein() {
  return new Promise(function(resolve, reject) {
    db.collection("timein", function(err, collection) {
      assert.equal(null, err);
      date = new Date();
      stringdate =
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      collection.find({ date: stringdate }).toArray(function(err, data) {
        if (err) {
          assert.equal(null, err);
        }
        else if(data[0])
        {
            resolve(data[0].timein);
        }
         else {
          resolve({});
        }
      });
    });
  });
}

async function getUsers() {
  return new Promise(function(resolve, reject) {
    db.collection("authUsers", function(err, collection) {
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
    db.collection("authUsers", function(err, collection) {
      assert.equal(null, err);
      collection.find({}).toArray(function(err, data) {
        if (err || !data) {
          assert.equal(null, err);
        } else {
          getUsers().then(users => {
            getTimein().then(time_d => {
              emails = "";
              for (i = 0; i < users.length; i++) {
                if (!time_d.hasOwnProperty(users[i].username)) {
                  emails+= users[i].email + ",";
                }
              }
              resolve(emails);
            });
          });
        }
      });
    });
  });
}
function updateTime(user, time, res) {
  // Get the collection
  const collection = db.collection("timein");
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
    res.send(false);
    print(e);
  }
};

function updateLeaves(user, leave, res) {
  // Get the collection
  const collection = db.collection("leaves");
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
    print(e);
  }
};

function sendTime(id, time, res) {
  getUsername(id).then(username => {
    db.collection("timein", function(err, collection) {
      assert.equal(null, err);
      //updatecollection
      updateTime(username, time, res);
    });
  });
};

function sendLeaves(id, leaves, res) {
  getUsername(id).then(username => {
    db.collection("timein", function(err, collection) {
      assert.equal(null, err);
      //updatecollection
      updateLeaves(username, leaves, res);
    });
  });
};
