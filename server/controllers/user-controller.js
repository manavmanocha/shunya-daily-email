/**************************************************
 * Include external modules
 **************************************************/

let Cookies = require("cookies");
const assert = require("assert");

/**************************************************
 * Include internal modules
 **************************************************/

let db = require("./databasecall-controller").getDBreference;
let getUsername = require("./databasecall-controller").getUsername;
let sendmail = require("./mailer-controller").sendmail;
let appconfig = require("../config/app-config");
let appConstant = require("../utils/constants");
/**************************************************
 * Exports
 **************************************************/

exports.loginUser = loginUser;
exports.createUser = createUser;
exports.removeUser = removeUser;
exports.checklogged = checklogged;
exports.changePassword = changePassword;
exports.changeUsername = changeUsername;
exports.forgotPassword = forgotPassword;
/**************************************************
 * Cookies options
 **************************************************/

let keys = [appconfig.cookie.secret];

/**************************************************
 * Login user (Check exists or not)
 **************************************************/
function loginUser(email, password, res, cookies) {
  db().collection(appconfig.database.collections.userCollection, function(
    err,
    collection
  ) {
    assert.equal(null, err);
    let _id, resobj;
    collection.findOne({ email: email }, { password: 1 }, function(err, data) {
      if (err || !data) {
        assert.equal(null, err);
        resobj = { status: false, _id: null, username: null };
      } else {
        if (password == data.password) {
          _id = data._id;
          resobj = {
            status: true,
            _id: data._id,
            username: data.username,
            admin: data.admin
          };
          cookies.set(appconfig.cookie.name, data._id, { signed: true });
        } else {
          resobj = { status: false, _id: null, uemail: null };
        }
      }
      res.send(resobj);
    });
  });
}

/**************************************************
 * Create new user
 **************************************************/
function createUser(user, res) {
  // Get the collection
  const collection = db().collection(
    appconfig.database.collections.userCollection
  );
  // Insert  user
  try {
    collection.findOne(
      { $or: [{ email: user.email }, { username: user.username }] },
      function(err, data) {
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
                Object.entries(user).forEach(([key, value]) => {
                  if (key != "_id") usertext += "<br>" + key + " : " + value;
                });
                sendmail(
                  user.email,
                  appConstant.MAIL.MAIL_TYPES.NEWACCOUNT,
                  usertext
                );
                res.send(true);
              }
            });
          } else {
            res.send(false);
          }
        }
      }
    );
  } catch (e) {
    res.send(false);
  }
}

/**************************************************
 * Remove user from system
 **************************************************/
function removeUser(user) {
  return new Promise(function(resolve, reject) {
    // Get the collection
    const collection = db().collection(
      appconfig.database.collections.userCollection
    );
    // Remove  user
    try {
      collection.findOne({ username: user }, function(err, data) {
        if (err) {
          assert.equal(null, err);
          resolve({ [user]: false });
        } else {
          if (data != null) {
            collection.remove({ username: user }, function(err, dbresponse) {
              if (err) {
                resolve({ [user]: false });
              } else {
                sendmail(data.email, appConstant.MAIL.MAIL_TYPES.DELETION);
                resolve({ [user]: true });
              }
            });
          } else {
            resolve({ [user]: false });
          }
        }
      });
    } catch (e) {
      resolve({ [user]: false });
    }
  });
}

/**************************************************
 * Check user already logged in or not
 **************************************************/
function checklogged(res, id) {
  getUsername(id)
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
}

/**************************************************
 * Change Password
 **************************************************/
function changePassword(user) {
  return new Promise(function(resolve, reject) {
    try {
      // Get the collection
      const collection = db().collection(
        appconfig.database.collections.userCollection
      );
      //Check and update user
      collection.findOne({ username: user.username }, function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data != null) {
            if (data.password == user.oldpassword) {
              collection.updateOne(
                { username: user.username },
                { $set: { password: user.newpassword } },
                { upsert: false }
              );
              resolve(1);
            } else {
              reject(1);
            }
          } else {
            reject(1);
          }
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**************************************************
 * Change Username
 **************************************************/
function changeUsername(user) {
  return new Promise(function(resolve, reject) {
    // Get the collection
    const collection = db().collection(
      appconfig.database.collections.userCollection
    );
    //Check and update user
    try {
      collection.findOne({ username: user.username }, function(err, data) {
        if (err) {
          assert.equal(null, err);
          reject(1);
        } else {
          if (data != null) {
            if (data.password == user.password) {
              collection.findOne({ username: user.newusername }, function(
                err,
                data
              ) {
                if (err) {
                  assert.equal(null, err);
                  reject(1);
                } else {
                  if (data == null) {
                    collection.updateOne(
                      { username: user.username },
                      { $set: { username: user.newusername } },
                      { upsert: false }
                    );
                    resolve(1);
                  } else {
                    reject(1); //username exists
                  }
                }
              });
            } else {
              reject(1); //password not matched
            }
          } else {
            reject(1); //user not found
          }
        }
      });
    } catch (e) {
      reject(1);
    }
  });
}

function generatePassword(length) {
  var password = "",
    character;
  while (length > password.length) {
    if (
      password.indexOf(
        (character = String.fromCharCode(Math.floor(Math.random() * 94) + 33)),
        Math.floor(password.length / 94) * 94
      ) < 0
    ) {
      password += character;
    }
  }
  return password;
}
/**************************************************
 * Forgot Password
 **************************************************/
function forgotPassword(email) {
  return new Promise(function(resolve, reject) {
    // Get the collection
    const collection = db().collection(
      appconfig.database.collections.userCollection
    );
    //Check and update user
    try {
      let newpassword = generatePassword(appConstant.PASSWORD_LENGTH);
      collection.updateOne(
        { email: email },
        { $set: { password: newpassword } },
        { upsert: false }
      );
      sendmail(email, appConstant.MAIL.MAIL_TYPES.PASSWORD_CHANGE, newpassword);
      resolve(1);
    } catch (e) {
      reject(1);
    }
  });
}
