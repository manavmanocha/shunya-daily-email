const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
let appconfig = require("../config/app-config");

const oauth2Client = new OAuth2(
  appconfig.mail.clientId, // ClientID
  appconfig.mail.clientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: appconfig.mail.refreshToken
});

exports.getAccessToken = function() {
  return oauth2Client
    .refreshAccessToken()
    .then(res => res.credentials.access_token);
};
