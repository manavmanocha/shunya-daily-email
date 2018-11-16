//It sends the mail using googleApi for gmail

let cron = require("node-cron");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
let dbcall = require("./databasecall");
const OAuth2 = google.auth.OAuth2;
let userconfig = require("./util/config");

const oauth2Client = new OAuth2(
  userconfig.client_id, // ClientID
  userconfig.client_secret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: userconfig.refresh_token
});

exports.sendmail=sendmail= function (receivers, mailtype,content="<br>") {
  //obtain access token from refresh token
  const accessToken = oauth2Client
    .refreshAccessToken()
    .then(res => res.credentials.access_token);

  //create mailer transporter
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: userconfig.user,
      clientId: userconfig.client_id,
      clientSecret: userconfig.client_secret,
      refreshToken: userconfig.refresh_token,
      accessToken: accessToken
    }
  });

  //set mail content
  const reminder_mailOptions = {
    from: userconfig.user, // sender address
    to: receivers, // list of receivers
    subject: "Timesheet Reminder", // Subject line
    html:
      "<p>Hey,<br><br> " +
      userconfig.mailtext[mailtype]+
      content +
      "<br><br> <b>Thanks and Regards,<br> DLS APPS </b> </p>"
  };

  //send mail
  smtpTransport.sendMail(reminder_mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}


exports.startSchedule = function() {
  cron.schedule(userconfig.scheduletime, () => {
  //cron.schedule("* * * * *", () => {
    dbcall.getuserReminder().then(users => {
      if (users) {
        sendmail(users,"reminder",remtext);
      } else {
        dbcall.getTimein().then(timein => {
          timetext="";
          Object.entries(timein).forEach(([key, value]) => timetext+='<br>'+key+':'+ value);
          sendmail(userconfig.timeinMailReciever,"timein", timetext);
        });
      }
    });
  });
};
