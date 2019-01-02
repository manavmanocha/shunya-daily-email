const nodemailer = require("nodemailer");
let getAccessToken=require("../utils/oauth-handler").getAccessToken;
let appconfig = require("../config/app-config");

exports.getsmtpTransporter= function(){
      let accessToken = getAccessToken();

      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: appconfig.mail.user,
          clientId: appconfig.mail.clientId,
          clientSecret: appconfig.mail.clientSecret,
          refreshToken: appconfig.mail.refreshToken,
          accessToken: accessToken
        }
      });
  }