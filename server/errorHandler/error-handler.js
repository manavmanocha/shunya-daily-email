"use strict";
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`;
});

const path = require('path');
/* 
//For logging to file
require('winston-daily-rotate-file');
const fs = require('fs');

const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
//const filename = path.join(logDir, 'results.log');
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

*/

const logger = createLogger({
  format: combine(
    format.label({ label: path.basename(module.parent.filename) }),
    colorize(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    myFormat
  ),
  transports: [
    new transports.Console()
    //,
    // new transports.Console({
    //   level: "error",
    //   handleExceptions: true
    // })
    //,new transports.File({ dailyRotateFileTransport })
  ],
  exitOnError: false
});

module.exports = logger;
