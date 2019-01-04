//It sends the mail using googleApi for gmail
let cron = require("node-cron");

let dbcall = require("./admin-controller");
let appConstant = require("../utils/constants");
let appconfig = require("../config/app-config");
let getsmtpTransporter = require("../utils/mail-transporter")
  .getsmtpTransporter;

function setMailOptions(receivers, mailtype, content) {
  let reminder_mailOptions = {
    from: appconfig.mail.user, // sender address
    to: receivers, // list of receivers
    subject: mailtype.SUBJECT, // Subject line
    html:
      appConstant.MAIL.MAIL_INTRO +
      mailtype.TEXT +
      content +
      appConstant.MAIL.MAIL_END
  };
  return reminder_mailOptions;
}

exports.sendmail = sendmail = function(receivers, mailtype, content = "<br>") {
  let transporter = getsmtpTransporter();
  let reminder_mailOptions = setMailOptions(receivers, mailtype, content);
  transporter.sendMail(reminder_mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    transporter.close();
  });
};

exports.startSchedule = function() {
  cron.schedule(appconfig.mail.reminderScheduleTime, () => {
    dbcall.getuserReminder().then(users => {
      if (users) {
        sendmail(users, appConstant.MAIL.MAIL_TYPES.REMINDER);
      }
    });
  });

  cron.schedule(appconfig.mail.timeinScheduleTime, () => {
    dbcall.getuserReminder().then(() => {
      dbcall.getTimein().then(timein => {
        if (timein) {
          timetext = "";
          Object.entries(timein).forEach(
            ([key, value]) => (timetext += "<br>" + key + ":" + value)
          );
          sendmail(
            appconfig.mail.timeinMailReciever,
            appConstant.MAIL.MAIL_TYPES.TIMEIN,
            timetext
          );
        }
      });
    });
  });
};
