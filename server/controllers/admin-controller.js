/*******************************************************************************
 * Admin Operations
 *******************************************************************************/

/**************************************************
 * Include external modules
 **************************************************/
const assert = require("assert");

/**************************************************
 * Include internal modules
 **************************************************/

let db = require("./databasecall-controller").getDBreference;
let appconfig = require("../config/app-config");

/**************************************************
 * Exports
 **************************************************/

exports.getTimein = getTimein;
exports.getuserReminder = getuserReminder;
exports.getUsers = getUsers;

/**************************************************
 * Get timein for all users for the day
 **************************************************/

async function getTimein() {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.timeInCollection, function(
      err,
      collection
    ) {
      assert.equal(null, err);
      date = new Date();
      stringdate =
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        (date.getMonth() + 1 < 10 ? "-0" : "-") +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear();
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

/**************************************************
 * Get all users of the system
 **************************************************/

async function getUsers() {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.userCollection, function(
      err,
      collection
    ) {
      assert.equal(null, err);
      collection.find({},{username: 1, _id:0}).toArray(function(err, data) {
        if (err || !data) {
          assert.equal(null, err);
        } else {
          resolve(data);
        }
      });
    });
  });
}

/**************************************************
 * Get users who need to be reminded
 **************************************************/

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
