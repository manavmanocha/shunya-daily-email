"use strict";
require("winston-daily-rotate-file");
const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");
const logDir = "log";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const myFormat = format.printf(
  info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD"
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.label({ label: path.basename(module.parent.filename) }),
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    myFormat
  ),
  transports: [new transports.Console(), dailyRotateFileTransport],
  exitOnError: false
});
module.exports = logger;
