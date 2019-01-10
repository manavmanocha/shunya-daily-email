/**************************************************
 * Include external modules
**************************************************/ 
let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let app = express();

/**************************************************
 * Include internal modules
**************************************************/ 
let api_route = require("./routes/route-handler");
let initializer= require("./controllers/connection-handler");

/**************************************************
 * Middleware layers used by Express
**************************************************/ 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));

app.use(express.static(path.join(__dirname, "..")));
app.use("/api", api_route);

/**************************************************
 * File Exports
**************************************************/ 
module.exports = app;

/**************************************************
 * Get method route serve index file
**************************************************/ 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

/**************************************************
 * Call initializer to connect to database 
 * and Start Scheduler
**************************************************/ 
initializer.connect();

/**************************************************
 * Listen on port
**************************************************/ 
const port = process.env.PORT || "3030";
app.listen(port, () =>
  console.log(`Timesheet app listening on port ${port}!`)

);



