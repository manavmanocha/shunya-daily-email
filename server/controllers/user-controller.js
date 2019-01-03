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
let ERROR_TYPES = require("../errorHandler/error-constants").ERROR_TYPES;
let ObjectID = require("mongodb").ObjectID;
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
  try {
    db().collection(appconfig.database.collections.userCollection, function(
      err,
      collection
    ) {
      if (err) {
        throw err;
      }
      let _id, resobj;
      collection.findOne({ email: email }, { password: 1 }, function(
        err,
        data
      ) {
        if (err) {
          throw err;
        } else if (!data) {
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
  } catch (err) {
    console.log("Login Error");
    console.log(e);
    res.send({ status: false, _id: null, uemail: null });
  }
}

/**************************************************
 * Create new user
 **************************************************/
function createUser(user) {
  try {
    return new Promise(function(resolve, reject) {
      // Get the collection
      const collection = db().collection(
        appconfig.database.collections.userCollection
      );
      // Insert  user

      collection.findOne(
        { $or: [{ email: user.email }, { username: user.username }] },
        function(err, data) {
          if (err) {
            console.log(err);
            reject(ERROR_TYPES.CREATE_USER.COLLECTION);
          } else {
            if (data == null) {
              collection.insertOne(user, function(err, dbresponse) {
                if (err) {
                  console.log(err);
                  reject(ERROR_TYPES.CREATE_USER.INSERTION);
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
                  resolve(1);
                }
              });
            } else {
              reject(ERROR_TYPES.CREATE_USER.USERDATA_EXISTS);
            }
          }
        }
      );
    });
  } catch (e) {
    reject(ERROR_TYPES.CHANGE_USERNAME.SESSION);
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
 * Check user
 **************************************************/

async function checkUser(id) {
  try {
    return new Promise(function(resolve, reject) {
      db().collection(appconfig.database.collections.userCollection, function(
        err,
        collection
      ) {
        if (err) {
          console.log("Check User");
          console.log(err);
          reject(ERROR_TYPES.CHECK_USER.COLLECTION);
        }
        collection.findOne({ _id: ObjectID(id) }, function(err, data) {
          if (err) {
            console.log("Check User");
            console.log(err);
            reject(ERROR_TYPES.CHECK_USER.COLLECTION);
          } else if (!data) {
            reject(ERROR_TYPES.CHECK_USER.SESSION);
          } else {
            resolve(data);
          }
        });
      });
    });
  } catch (err) {
    console.log("Check User");
    console.log(err);
    reject(err);
  }
}

/**************************************************
 * Check user already logged in or not
 **************************************************/
function checklogged(res, id) {
  checkUser(id)
    .then(data => {
      res.send({ status: true, admin: data.admin });
    })
    .catch(err => {
      res.send({ status: false });
    });
}

/**************************************************
 * Change Password
 **************************************************/
function changePassword(user, id) {
  try {
    return new Promise(function(resolve, reject) {
      // Get the collection
      const collection = db().collection(
        appconfig.database.collections.userCollection
      );
      //Check and update user
      collection.findOne({ _id: id }, function(err, data) {
        if (err) {
          console.log(err);
          reject(ERROR_TYPES.CHANGE_PASSWORD.COLLECTION);
        } else {
          if (data != null) {
            if (data.password == user.oldpassword) {
              collection.updateOne(
                { _id: id },
                { $set: { password: user.newpassword } },
                { upsert: false }
              );
              resolve(1);
            } else {
              reject(ERROR_TYPES.CHANGE_PASSWORD.PASSWORD);
            }
          } else {
            reject(ERROR_TYPES.CHANGE_PASSWORD.SESSION);
          }
        }
      });
    });
  } catch (err) {
    console.log("Change Password Error Catch");
    console.log(err);
    reject(err);
  }
}

/**************************************************
 * Change Username
 **************************************************/
function changeUsername(user, id) {
  try {
    return new Promise(function(resolve, reject) {
      // Get the collection
      const collection = db().collection(
        appconfig.database.collections.userCollection
      );
      collection.findOne({ _id: id }, function(err, data) {
        if (err) {
          console.log(err);
          reject(ERROR_TYPES.CHANGE_USERNAME.COLLECTION);
        } else {
          if (data != null) {
            if (data.password == user.password) {
              collection.findOne({ username: user.newusername }, function(
                err,
                data
              ) {
                if (err) {
                  console.log(err);
                  reject(ERROR_TYPES.CHANGE_USERNAME.COLLECTION);
                } else {
                  if (data == null) {
                    collection.updateOne(
                      { username: user.username },
                      { $set: { username: user.newusername } },
                      { upsert: false }
                    );
                    resolve(1);
                  } else {
                    reject(ERROR_TYPES.CHANGE_USERNAME.USERNAME_EXISTS);
                  }
                }
              });
            } else {
              reject(ERROR_TYPES.CHANGE_USERNAME.PASSWORD_NOT_MATCHED);
            }
          } else {
            reject(ERROR_TYPES.CHANGE_USERNAME.SESSION);
          }
        }
      });
    });
  } catch (e) {
    console.log("Change Username Error Catch");
    console.log(err);
    reject(err);
  }
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
    try {
      const collection = db().collection(
        appconfig.database.collections.userCollection
      );
      //Check and update user
      collection.findOne({ email: email }, function(err, data) {
        if (err) {
          console.log(err);
          reject(ERROR_TYPES.FORGOT_PASSWORD.COLLECTION);
        } else {
          if (data != null) {
            let newpassword = generatePassword(appConstant.PASSWORD_LENGTH);
            collection.updateOne(
              { email: email },
              { $set: { password: newpassword } },
              { upsert: false }
            );

            sendmail(
              email,
              appConstant.MAIL.MAIL_TYPES.PASSWORD_CHANGE,
              newpassword
            );
            resolve(1);
          } else {
            reject(ERROR_TYPES.FORGOT_PASSWORD.INVALID);
          }
        }
      });
    } catch (e) {
      reject(ERROR_TYPES.FORGOT_PASSWORD.COLLECTION);
    }
  });
}
