//It sends the mail using googleApi for gmail

var cron = require("node-cron");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
var dbcall = require("./databasecall");

const OAuth2 = google.auth.OAuth2;
const client_id =
  "260876868865-g1h7ai3tb127cjdtcl5bhruemvaehlh1.apps.googleusercontent.com";
const client_secret = "jsU9YxOSgDQh65Ms4GwspGaA";
const refresh_token = "1/CLyIo-KQGqdEiXPHtogO-aeiBkgWSNQ1QowDyEiUIIQ";
const user = "app.timesheet.dls@gmail.com";
const oauth2Client = new OAuth2(
  client_id, // ClientID
  client_secret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: refresh_token
});

function sendmail(receivers, content) {
  //obtain access token from refresh token
  const accessToken = oauth2Client
    .refreshAccessToken()
    .then(res => res.credentials.access_token);

  //create mailer transporter
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: user,
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken: refresh_token,
      accessToken: accessToken
    }
  });

  //set mail content
  const reminder_mailOptions = {
    from: user, // sender address
    to: receivers, // list of receivers
    subject: "Timesheet Reminder", // Subject line
    html:
      "<p>Hey,<br><br> " +
      content +
      "<br><br> <b>Thanks and Regards,<br> DLS APPS </b> </p>"
  };

  //send mail
  smtpTransport.sendMail(reminder_mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}

const remtext =
  "You forgot to enter the time in the System. We request you to kindly update your entry for today.";

exports.startSchedule = function() {
  cron.schedule("* 10,12,15 * * Monday-Friday", () => {
  //cron.schedule("* * * * *", () => {
    dbcall.getuserReminder().then(users => {
      if (users) {
        sendmail(users, remtext);
      } else {
        dbcall.getTimein().then(timein => {
          timein = JSON.stringify(timein);
          sendmail("app.timesheet.dls@gmail.com", timein);
        });
      }
    });
  });
};
