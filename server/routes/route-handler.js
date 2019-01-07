/**************************************************
 * Include external modules
 **************************************************/

let Cookies = require("cookies");
let router = require("express").Router();
let ObjectID = require("mongodb").ObjectID;

/**************************************************
 * Include internal modules
 **************************************************/

let userController = require("../controllers/user-controller");
let timeinController = require("../controllers/timein-controller");
let leavesController = require("../controllers/leaves-controller");
let adminController = require("../controllers/admin-controller");
let viewController = require("../controllers/view-controller");
let appconfig = require("../config/app-config");
let ERROR_TYPES = require("../errorHandler/error-constants").ERROR_TYPES;
let logger = require("../errorHandler/error-handler");

/**************************************************
 * Exports
 **************************************************/

module.exports = router;

/**************************************************
 * Cookies options
 **************************************************/

let keys = [appconfig.cookie.secret];

/*******************************************************************************
 * Handle Routes
 *******************************************************************************/

/**************************************************
 * Login Request
 **************************************************/

router.post("/login", function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let cookies = new Cookies(req, res, { keys: keys });
  //Logn user
  userController.loginUser(email, password, res, cookies);
});

/**************************************************
 * Fill Timein Request
 **************************************************/

router.post("/timein", function(req, res, next) {
  let time = req.body.time;
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  if (id) {
    timeinController.saveTime(id, time, res);
  } else {
    logger.log('error',JSON.stringify(ERROR_TYPES.UPDATE_TIME.SESSION));
    res.send({
      status: false,
      errObject: ERROR_TYPES.UPDATE_TIME.SESSION
    });
  }
});
/**************************************************
 * Get Timein
 **************************************************/

router.get("/getTime", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  if (id) {
    timeinController.getTime(id, res);
  } else {
    logger.log('error',JSON.stringify(ERROR_TYPES.FIND_TIME.SESSION));
    res.send({
      status: false,
      errObject: ERROR_TYPES.FIND_TIME.SESSION
    });
  }
});

/**************************************************
 * Create new user request
 **************************************************/

router.post("/createuser", function(req, res, next) {
  let user = req.body.user;
  user.password = "Compro11";
  userController
    .createUser(user)
    .then(() => {
      res.send({
        status: true
      });
    })
    .catch(response => {;
      res.send({
        status: false,
        errObject: response
      });
    });
});

/**************************************************
 * Get all usernames of the system
 **************************************************/

router.get("/getallusernames", function(req, res, next) {
  adminController.getUsers().then(users => {
    usernames = [];
    for (i = 0; i < users.length; i++) {
      usernames.push(users[i].username);
    }
    res.send(usernames);
  });
});

/**************************************************
 * Remove a user from the system
 **************************************************/

router.post("/removeusers", function(req, res, next) {
  let users = req.body.users;
  let returnobj = [];
  let c = 0;
  new Promise(function(resolve, reject) {
    users.forEach(user => {
      userController.removeUser(user, res).then(result => {
        returnobj.push(result);
        if (returnobj.length == users.length) {
          resolve(true);
        }
      });
    });
  }).then(() => {
    res.send(returnobj);
  });
});

/**************************************************
 * Fill Leaves Request
 **************************************************/

router.post("/sendleaves", function(req, res, next) {
  let leaves = req.body.leave;
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  //Send Leaves
  if (id) {
    leavesController.sendLeaves(id, leaves, res);
  } else {
    logger.log('error',JSON.stringify(ERROR_TYPES.UPDATE_TIME.SESSION));
    res.send({
      status: false,
      errObject: ERROR_TYPES.UPDATE_TIME.SESSION
    });
  }
});
/**************************************************
 * Get pending leaves
 **************************************************/
router.get("/pendingLeaves", function(req, res, next) {
  leavesController
    .getPendingLeaves()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      logger.log('info',err);
      res.send(null);
    });
});

/**************************************************
 * Get approved leaves
 **************************************************/
router.get("/approvedLeaves", function(req, res, next) {
  leavesController
    .getApprovedLeaves()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      logger.log('info',err);
      res.send(null);
    });
});

/**************************************************
 * Get leaves of a user
 **************************************************/
router.get("/getLeaves", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  if (id) {
    leavesController
      .getmyLeaves(id)
      .then(leaves => {
        res.send({
          status: true,
          leaves: leaves
        });
      })
      .catch(err => {
        res.send({
          status: false,
          errObject: err
        });
      });
  } else {
    logger.log('error',JSON.stringify(ERROR_TYPES.GET_LEAVES.SESSION));
    res.send({
      status: false,
      errObject: ERROR_TYPES.GET_LEAVES.SESSION
    });
  }
});

/**************************************************
 * Get leave record of a user
 **************************************************/
router.post("/getLeaveRecord", function(req, res, next) {
  let user = req.body.user;
  if (user) {
    leavesController
      .getmyLeaveRecord(user)
      .then(leaves => {
        res.send({
          status: true,
          leaves: leaves
        });
      })
      .catch(err => {
        res.send({
          status: false,
          errObject: err
        });
      });
  }
});

/**************************************************
 * Cancel leaves
 **************************************************/
router.post("/cancelLeaves", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  let cancel = req.body.cancel;
  if (cancel && id) {
    leavesController
      .cancelLeaves(cancel, id)
      .then(leaves => {
        res.send({
          status: true,
          leaves: leaves
        });
      })
      .catch(err => {
        res.send({
          status: false,
          errObject: err
        });
      });
  } else {
    logger.log('error',JSON.stringify(ERROR_TYPES.CANCEL_LEAVES.SESSION));
    res.send({
      status: false,
      errObject: ERROR_TYPES.CANCEL_LEAVES.SESSION
    });
  }
});

/**************************************************
 * Approve leaves
 **************************************************/
router.post("/approveTheLeave", function(req, res, next) {
  let leave_app = req.body.leave;
  leavesController
    .approveTheLeave(leave_app)
    .then(() => {
      res.send({
        status: true
      });
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
});

/**************************************************
 * Unapprove leaves
 **************************************************/
router.post("/unapproveTheLeave", function(req, res, next) {
  let leave_app = req.body.leave;
  leavesController
    .unapproveTheLeave(leave_app)
    .then(() => {
      res.send({
        status: true
      });
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
});

/**************************************************
 * Reject leaves
 **************************************************/
router.post("/rejectTheLeave", function(req, res, next) {
  let leave_app = req.body.leave;
  leavesController
    .rejectTheLeave(leave_app)
    .then(() => {
      res.send({
        status: true
      });
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
});

/**************************************************
 * Monthly report
 **************************************************/
router.post("/viewMonthly", function(req, res, next) {
  let view = req.body.view;
  viewController
    .viewMonthly(view)
    .then(report => {
      res.send(report);
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
});

/**************************************************
 * Yearly report
 **************************************************/
router.post("/viewYearly", function(req, res, next) {
  let view = req.body.view;
  viewController
    .viewYearly(view)
    .then(report => {
      res.send(report);
    })
    .catch(err => {
      res.send({
        status: false,
        errObject: err
      });
    });
});

/**************************************************
 * Checked user logged in
 **************************************************/
router.get("/checklogged", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  userController.checklogged(res, id);
});

/**************************************************
 * Logout
 **************************************************/
router.get("/logout", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  res.clearCookie(appconfig.cookie.name);
  res.send(true);
});

/**************************************************
 * Change Password
 **************************************************/
router.post("/changepassword", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  let user = req.body.userchange;
  userController
    .changePassword(user, ObjectID(id))
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
});

/**************************************************
 * Change Username
 **************************************************/
router.post("/changeusername", function(req, res, next) {
  let cookies = new Cookies(req, res, { keys: keys });
  let id = cookies.get(appconfig.cookie.name, { signed: true });
  let user = req.body.userchange;
  userController
    .changeUsername(user, ObjectID(id))
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
});

/**************************************************
 * Forgot Password
 **************************************************/
router.post("/forgotPassword", function(req, res, next) {
  let email = req.body.email;
  userController
    .forgotPassword(email)
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
});
