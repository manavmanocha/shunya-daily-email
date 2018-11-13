var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var api = require("./routes/api");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static(path.join(__dirname, "../dist")));
app.use("/api", api);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const port = process.env.PORT || "3030";
app.listen(port, () =>
  console.log(`Employee app listening on port ${port}!`)
);


module.exports = app;
