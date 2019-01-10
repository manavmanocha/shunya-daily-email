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
let ERROR_TYPES = require("../logger/error-constants").ERROR_TYPES;
let logger = require("../logger/log-handler");

/**************************************************
 * Exports
 **************************************************/
exports.saveTime = saveTime;
exports.getTime = getTime;

/**************************************************
 * Update time for the user
 **************************************************/
function updateTime(user, time) {
  try {
    return new Promise(function(resolve, reject) {
      db().collection(appconfig.database.collections.timeInCollection, function(
        err,
        collection
      ) {
        if (err) {
          let errObj = Object.assign({}, ERROR_TYPES.UPDATE_TIME.COLLECTION);
          errObj.err = err;
          logger.info();
          logger.log("error", JSON.stringify(errObj));
          reject(errObj);
        }
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
      });
    });
  } catch (err) {
    let errObj = Object.assign({}, ERROR_TYPES.UPDATE_TIME.UPDATE);
    errObj.err = err;
    logger.info();
    logger.log("error", JSON.stringify(errObj));
    reject(errObj);
  }
}

/**************************************************
 * Get time for the user
 **************************************************/
function findTime(user) {
  try {
    return new Promise(function(resolve, reject) {
      db().collection(appconfig.database.collections.timeInCollection, function(
        err,
        collection
      ) {
        if (err) {
          let errObj = Object.assign({}, ERROR_TYPES.FIND_TIME.COLLECTION);
          errObj.err = err;
          logger.info();
          logger.log("error", JSON.stringify(errObj));
          reject(errObj);
        }
        date = new Date();
        stringdate =
          (date.getDate() < 10 ? "0" : "") +
          date.getDate() +
          (date.getMonth() + 1 < 10 ? "-0" : "-") +
          (date.getMonth() + 1) +
          "-" +
          date.getFullYear();
        collection.findOne({ date: stringdate }, function(err, data) {
          if (err) {
            let errObj = Object.assign({}, ERROR_TYPES.FIND_TIME.COLLECTION);
            errObj.err = err;
            logger.info();
            logger.log("error", JSON.stringify(errObj));
            reject(errObj);
          } else if (!data) {
            resolve(false);
          } else {
            resolve(data.timein[user]);
          }
        });
      });
    });
  } catch (err) {
    logger.info();
    logger.log("error", err);
    reject(err);
  }
}

/**************************************************
 * Get username and call update time using username
 **************************************************/
function saveTime(id, time, res) {
  getUsername(id)
    .then(username => {
      updateTime(username, time).then(() => {
        res.send({ status: true });
      });
    })
    .catch(err => {
      logger.info();
      logger.log("error", err);
      res.send({
        status: false,
        errObject: err
      });
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
          res.send({ status: true, time: value });
        } else {
          res.send({ status: false });
        }
      });
    })
    .catch(err => {
      logger.info();
      logger.log("error", err);
      res.send({
        status: false,
        errObject: err
      });
    });
}
