module.exports = {
  PASSWORD_LENGTH: 10,
  DATABASE: {},
  MAIL: {
    MAIL_INTRO: "<p>Hello,<br><br> ",
    MAIL_END: "<br><br> <b>Thanks,<br> DLS APPS </b> </p>",
    MAIL_TYPES: {
      NEWACCOUNT: {
        TEXT:
          "Your account for time entry has been created. Please find the details below",
        SUBJECT: "Welcome Mail"
      },
      REMINDER: {
        TEXT:
          "You forgot to enter the time in the System. We request you to kindly update your entry for today.",
        SUBJECT: "Time in Reminder"
      },
      DELETION: {
        TEXT:
          "Your account has been removed by the admin. You won't be able to make entries to system.",
        SUBJECT: "Account Removal"
      },
      TIMEIN: {
        TEXT: "",
        SUBJECT: "Arrival Time"
      },
      PASSWORD_CHANGE: {
        TEXT:
          "We recieved password change request from you. We have reset password for you. You can login using password below and change it afterwards.<br>",
        SUBJECT: "Reset Password"
      }
    }
  }
};
