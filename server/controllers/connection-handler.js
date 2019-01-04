/*******************************************************************************
 * Create database connection and start scheduler
 *******************************************************************************/

/**************************************************
 * Include internal modules
 **************************************************/

let dbController = require("./databasecall-controller");
let scheduler = require("./mailer-controller").startSchedule;

/**************************************************
 * Database Connection
 * and Scheduler Starter
 **************************************************/

exports.connect = function() {
  dbController
    .connect()
    .then(() => {
      scheduler();
    })
    .catch(err => {
      console.log(err);
    });
};
