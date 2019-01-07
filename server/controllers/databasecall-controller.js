/**************************************************
 * Include external modules
 **************************************************/

const assert = require("assert");
let ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

/**************************************************
 * Include internal modules
 **************************************************/

let appconfig = require("../config/app-config");
let ERROR_TYPES = require("../errorHandler/error-constants").ERROR_TYPES;
let logger = require("../errorHandler/error-handler");

/**************************************************
 * Exports
 **************************************************/

exports.connect = connect;
exports.getUsername = getUsername;

/**************************************************
 * Globals
 **************************************************/
let db;

/**************************************************
 * Database Connection
 **************************************************/

function connect() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(
      appconfig.database.uri,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        //Change Database
        db = client.db(appconfig.database.dbName);
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

/**************************************************
 * Get username from id
 **************************************************/

async function getUsername(id) {
  try {
    return new Promise(function(resolve, reject) {
      db.collection(appconfig.database.collections.userCollection, function(
        err,
        collection
      ) {
        if (err) {
          logger.log('info',JSON.stringify(ERROR_TYPES.GET_USERNAME.COLLECTION));
          logger.debug(err);
          reject(ERROR_TYPES.GET_USERNAME.COLLECTION);
        }
        collection.findOne({ _id: ObjectID(id) }, function(err, data) {
          if (err) {
            logger.log('info',JSON.stringify(ERROR_TYPES.GET_USERNAME.COLLECTION));
            logger.debug(err);
            reject(ERROR_TYPES.GET_USERNAME.COLLECTION);
          } else if (!data) {
            logger.log('info',JSON.stringify(ERROR_TYPES.GET_USERNAME.SESSION));
            reject(ERROR_TYPES.GET_USERNAME.SESSION);
          } else {
            resolve(data.username);
          }
        });
      });
    });
  } catch (err) {
    logger.log('info',err);
    reject(err);
  }
}

/**************************************************
 * Get Database Reference
 **************************************************/

exports.getDBreference = function() {
  return db;
};
