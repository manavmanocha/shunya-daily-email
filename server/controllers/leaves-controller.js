/*******************************************************************************
 * Leaves Hadling Operation
 *******************************************************************************/

/**************************************************
 * Include external modules
 **************************************************/

const assert = require("assert");
const Timestamp = require("mongodb").Timestamp;

/**************************************************
 * Include internal modules
 **************************************************/

let db = require("./databasecall-controller").getDBreference;
let getUsername = require("./databasecall-controller").getUsername;
let appconfig = require("../config/app-config");

/**************************************************
 * Exports
 **************************************************/

exports.updateLeaves = updateLeaves;
exports.sendLeaves = sendLeaves;
exports.getPendingLeaves = getPendingLeaves;
exports.getmyLeaves = getmyLeaves;
exports.getApprovedLeaves = getApprovedLeaves;
exports.approveTheLeave = approveTheLeave;
exports.unapproveTheLeave = unapproveTheLeave;
exports.rejectTheLeave = rejectTheLeave;
exports.cancelLeaves = cancelLeaves;
exports.getmyLeaveRecord = getmyLeaveRecord;
/**************************************************
 * Update Leaves for the user
 **************************************************/
function updateLeaves(user, leave, res) {
  try {
    return new Promise(function(resolve, reject) {
      db().collection(appconfig.database.collections.leaveCollection, function(
        err,
        collection
      ) {
        if (err) {
          console.log("Update Leaves");
          console.log(err);
          reject(ERROR_TYPES.UPDATE_LEAVES.COLLECTION);
        }
        (timestamp = new Timestamp(0, Math.floor(new Date().getTime() / 1000))),
          (updateobj =
            appconfig.database.documents.leaves.applyParentNode + timestamp);
        collection.updateOne(
          { user: user },
          { $set: { [updateobj]: leave } },
          { upsert: true }
        );
        resolve(true);
      });
    });
  } catch (err) {
    console.log("Check User");
    console.log(err);
    reject(err);
  }
}

/**************************************************
 * Get username and call update Leaves using username
 **************************************************/
function sendLeaves(id, leaves, res) {
  getUsername(id)
    .then(username => {
      updateLeaves(username, leaves, res)
        .then(() => {
          res.send({
            status: true
          });
        })
        .catch(response => {
          res.send({
            status: false,
            errObject: response
          });
        });
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
}

/**************************************************
 * Get Leaves using username
 **************************************************/
function getmyLeaves(id) {
  return new Promise(function(resolve, reject) {
    getUsername(id)
      .then(user => {
        db().collection(
          appconfig.database.collections.leaveCollection,
          function(err, collection) {
            collection.findOne({ user: user }, function(err, data) {
              if (err || !data) {
                if (err) {
                  reject(ERROR_TYPES.GET_LEAVES.COLLECTION);
                }
              } else {
                let leaves = [];
                if (data.approved != undefined) {
                  Object.entries(data.approved).forEach(([key, value]) => {
                    value.type = "A";
                    value.id = key;
                    leaves.push(value);
                  });
                }
                if (data.pending != undefined) {
                  Object.entries(data.pending).forEach(([key, value]) => {
                    value.type = "P";
                    value.id = key;
                    leaves.push(value);
                  });
                }
                resolve(leaves);
              }
            });
          }
        );
      })
      .catch(err => {
        console.log("Get my leaves");
        res.send({
          status: false,
          errObject: err
        });
      });
  });
}

/**************************************************
 * Get Leave Record using username
 **************************************************/
function getmyLeaveRecord(user) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      collection.findOne({ user: user }, function(err, data) {
        if (err) {
          reject(ERROR_TYPES.RECORD_LEAVES.COLLECTION);
        }
        if (!data) {
          resolve(1);
        } else {
          let leaves = [];
          if (data.approved != undefined) {
            Object.entries(data.approved).forEach(([key, value]) => {
              leaves.push(value);
            });
          }
          resolve(leaves);
        }
      });
    });
  });
}
/**************************************************
 * Get Pending Leaves
 **************************************************/
async function getPendingLeaves() {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      if (err) {
        reject(ERROR_TYPES.PENDING_LEAVES.COLLECTION);
      }
      let leave = [];
      collection.find({}, { pending: 1, user: 1, _id: 0 }).forEach(
        function(data) {
          if (!data) {
            reject(ERROR_TYPES.PENDING_LEAVES.EMPTY);
          } else {
            if (data.pending != undefined) {
              leave.push({ name: data.user, dates: data.pending });
            }
          }
        },
        function() {
          resolve(leave);
        }
      );
    });
  });
}

/**************************************************
 * Get Approved Leaves
 **************************************************/
async function getApprovedLeaves() {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      if (err) {
        reject(ERROR_TYPES.APPROVED_LEAVES.COLLECTION);
      }
      let approvedleave = [];
      collection.find({}, { approved: 1, user: 1, _id: 0 }).forEach(
        function(data) {
          if (!data) {
            reject(ERROR_TYPES.APPROVED_LEAVES.EMPTY);
          } else {
            if (data.approved != undefined) {
              approvedleave.push({ name: data.user, dates: data.approved });
            }
          }
        },
        function() {
          resolve(approvedleave);
        }
      );
    });
  });
}

/**************************************************
 * Approve the Leaves (move from pending to approved)
 **************************************************/
function approveTheLeave(leave_app, res) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      if (err) {
        reject(ERROR_TYPES.APPROVE_LEAVES.COLLECTION);
      }
      try {
        timestamp = new Timestamp(0, Math.floor(new Date().getTime() / 1000));
        let removeobj =
          appconfig.database.documents.leaves.applyParentNode + leave_app.id;
        collection.updateOne(
          { user: leave_app.name },
          { $unset: { [removeobj]: "" } }
        );
        updateobj =
          appconfig.database.documents.leaves.approveParentNode + timestamp;
        collection.updateOne(
          { user: leave_app.name },
          { $set: { [updateobj]: leave_app.dates } },
          { upsert: true }
        );
        resolve(1);
      } catch (e) {
        reject(ERROR_TYPES.APPROVE_LEAVES.UPDATE);
      }
    });
  });
}

/**************************************************
 * Unapprove the Leaves (move from approved to pending)
 **************************************************/
function unapproveTheLeave(leave_app) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      if (err) {
        reject(ERROR_TYPES.UNAPPROVE_LEAVE.COLLECTION);
      }
      try {
        timestamp = new Timestamp(0, Math.floor(new Date().getTime() / 1000));
        let removeobj =
          appconfig.database.documents.leaves.approveParentNode + leave_app.id;
        collection.updateOne(
          { user: leave_app.name },
          { $unset: { [removeobj]: "" } }
        );
        updateobj =
          appconfig.database.documents.leaves.applyParentNode + timestamp;
        collection.updateOne(
          { user: leave_app.name },
          { $set: { [updateobj]: leave_app.dates } },
          { upsert: true }
        );
        resolve(1);
      } catch (e) {
        reject(ERROR_TYPES.UNAPPROVE_LEAVE.UPDATE);
      }
    });
  });
}

/**************************************************
 * Reject the Leaves (move from pending to rejected)
 **************************************************/
function rejectTheLeave(leave_app, res) {
  return new Promise(function(resolve, reject) {
    db().collection(appconfig.database.collections.leaveCollection, function(
      err,
      collection
    ) {
      if (err) {
        reject(ERROR_TYPES.REJECT_LEAVE.COLLECTION);
      }
      try {
        timestamp = new Timestamp(0, Math.floor(new Date().getTime() / 1000));
        let removeobj =
          appconfig.database.documents.leaves.applyParentNode + leave_app.id;
        collection.updateOne(
          { user: leave_app.name },
          { $unset: { [removeobj]: "" } }
        );
        updateobj =
          appconfig.database.documents.leaves.rejectParentNode + timestamp;
        collection.updateOne(
          { user: leave_app.name },
          { $set: { [updateobj]: leave_app.dates } },
          { upsert: true }
        );
        resolve(1);
      } catch (e) {
        reject(ERROR_TYPES.REJECT_LEAVE.UPDATE);
      }
    });
  });
}

/**************************************************
 * Cancel the Leaves (delete from collection)
 **************************************************/
function cancelLeaves(cancel_app, id) {
  return new Promise(function(resolve, reject) {
    try {
      getUsername(id)
        .then(user => {
          db().collection(
            appconfig.database.collections.leaveCollection,
            function(err, collection) {
              if (err) {
                reject(ERROR_TYPES.CANCEL_LEAVES.COLLECTION);
              }
              let removeobj;
              if (cancel_app.type == "A") {
                removeobj =
                  appconfig.database.documents.leaves.approveParentNode +
                  cancel_app.id;
              } else if (cancel_app.type == "P") {
                removeobj =
                  appconfig.database.documents.leaves.applyParentNode +
                  cancel_app.id;
              }
              collection.updateOne(
                { user: user },
                { $unset: { [removeobj]: "" } }
              );
              resolve(1);
            }
          );
        })
        .catch(err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}
