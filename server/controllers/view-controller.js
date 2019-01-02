/**************************************************
 * Include external modules
 **************************************************/

let Cookies = require("cookies");
const assert = require("assert");
let ObjectID = require("mongodb").ObjectID;
/**************************************************
 * Include internal modules
 **************************************************/

let db = require("./databasecall-controller").getDBreference;
let appconfig = require("../config/app-config");
let appConstant = require("../utils/constants");
/**************************************************
 * Exports
 **************************************************/

exports.viewYearly = viewYearly;
exports.viewMonthly = viewMonthly;

function idFromDate(date) {
  return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
}

/**************************************************
 * Get yearly report data for user
 **************************************************/
function viewYearly(view) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.timeInCollection, function(
      err,
      collection
    ) {
      let startdate = new Date(view.year, 0, 1);
      let enddate = new Date(view.year, 11, 31);
      let startid = "" + idFromDate(startdate);
      let endid = "" + idFromDate(enddate);
      let reportData = [];
      collection.find(
        {
          $and: [
            { _id: { $gte: ObjectID(startid) } },
            { _id: { $lte: ObjectID(endid) } }
          ]
        }).forEach(
        function(data) {
          if (err || !data) {
            assert.equal(null, err);
            reject(err);
          } else {
            if(data.timein[view.user]!=undefined)
            reportData.push({date:data.date,timein:data.timein[view.user]});
          }
        },
        function() {
          resolve(reportData);
        }
      );
    });
  });
}

/**************************************************
 *Get monthly report data for user
 **************************************************/
function viewMonthly(view) {
    return new Promise(function(resolve, reject) {
      db().collection(appconfig.database.collections.timeInCollection, function(
        err,
        collection
      ) {
        let allmonths= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let startdate = new Date(view.year, allmonths.indexOf(view.month), 1);
        let enddate = new Date(view.year, allmonths.indexOf(view.month), 31);
        let startid = "" + idFromDate(startdate);
        let endid = "" + idFromDate(enddate);
        let reportData = [];
        collection.find(
          {
            $and: [
              { _id: { $gte: ObjectID(startid) } },
              { _id: { $lte: ObjectID(endid) } }
            ]
          }).forEach(
          function(data) {
            if (err || !data) {
              assert.equal(null, err);
              reject(err);
            } else {
              if(data.timein[view.user]!=undefined)
              reportData.push({date:data.date,timein:data.timein[view.user]});
            }
          },
          function() {
            resolve(reportData);
          }
        );
      });
    });
  }
  