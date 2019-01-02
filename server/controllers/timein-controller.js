/**************************************************
 * Include external modules
 **************************************************/

const assert = require("assert");

/**************************************************
 * Include internal modules
 **************************************************/

let db = require("./databasecall-controller").getDBreference;
let getUsername = require("./databasecall-controller").getUsername;
let appconfig = require("../config/app-config");

/**************************************************
 * Exports
 **************************************************/
exports.saveTime = saveTime;
exports.getTime = getTime;

/**************************************************
 * Update time for the user
 **************************************************/
function updateTime(user, time) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.timeInCollection, function(
      err,
      collection
    ) {
      assert.equal(null, err);
      try {
        date = new Date();
        stringdate =
          (date.getDate() < 10 ? "0" : "") +
          date.getDate() +
          (date.getMonth() + 1 < 10 ? "-0" : "-") +
          (date.getMonth() + 1) +
          "-" +
          date.getFullYear();
        updateobj = appconfig.database.documents.timein.userParentNode + user;
        collection.updateOne(
          { date: stringdate },
          { $set: { [updateobj]: time } },
          { upsert: true }
        );
        resolve(1);
      } catch (e) {
        console.log("Update Time Error");
        reject(e);
      }
    });
  });
}

/**************************************************
 * Get time for the user
 **************************************************/
function findTime(user) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.timeInCollection, function(
      err,
      collection
    ) {
      assert.equal(null, err);
      try {
        date = new Date();
        stringdate =
          (date.getDate() < 10 ? "0" : "") +
          date.getDate() +
          (date.getMonth() + 1 < 10 ? "-0" : "-") +
          (date.getMonth() + 1) +
          "-" +
          date.getFullYear();
        collection.findOne({ date: stringdate }, function(err, data) {
          if (err || !data) {
            assert.equal(null, err);
            reject(false);
          } else {
            resolve(data.timein[user]);
          }
        });
      } catch (e) {
        console.log("Find Time Error");
        reject(e);
      }
    });
  });
}

/**************************************************
 * Get username and call update time using username
 **************************************************/
function saveTime(id, time, res) {
  getUsername(id)
    .then(username => {
      updateTime(username, time).then(() => {
        res.send({ type: "Response", status: true });
      });
    })
    .catch(e => {
      res.send({
        type: "Timein Error",
        status: false,
        value: "Id not matched"
      });
      console.log("Save Time Error");
      console.log(e);
    });
}

/**************************************************
 * Get username and send time
 **************************************************/
function getTime(id, res) {
  getUsername(id)
    .then(username => {
      findTime(username).then(value => {
        if (value) {
          res.send({ type: "Response", status: true, time: value });
        } else {
          res.send({ type: "Response", status: false });
        }
      });
    })
    .catch(e => {
      console.log("Get Time Error");
      console.log(e);
      res.send({
        type: "Get Time Error",
        status: false,
        value: "Id not matched"
      });
    });
}
