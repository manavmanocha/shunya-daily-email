module.exports = {
  database: {
    dbName: "Timesheet",
    uri:
      "mongodb+srv://User1:1P1Vjy9Bb0tr664Y@cluster0-dwnar.mongodb.net/test?retryWrites=true",
    collections: {
      userCollection: "authUsers",
      timeInCollection: "timein",
      leaveCollection: "leaves"
    },
    documents:{
      timein:{
        userParentNode:"timein."
      },
      leaves:{
        applyParentNode:"pending.",
        approveParentNode:"approved.",
        rejectParentNode:"rejected."
      }
    }
  },
  mail: {
    clientId:
      "260876868865-g1h7ai3tb127cjdtcl5bhruemvaehlh1.apps.googleusercontent.com",
    clientSecret: "jsU9YxOSgDQh65Ms4GwspGaA",
    refreshToken: "1/CLyIo-KQGqdEiXPHtogO-aeiBkgWSNQ1QowDyEiUIIQ",
    user: "app.timesheet.dls@gmail.com",
    timeinMailReciever: "app.timesheet.dls@gmail.com",
    reminderScheduleTime: "0 0,30 11,12,13 * * Monday-Friday",
    timeinScheduleTime: "0 0 14 * * Monday-Friday"
  },
  cookie:{
    name:"uid",
    secret:"keyboard cat"
  }
};
