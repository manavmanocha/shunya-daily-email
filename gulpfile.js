var gulp = require("gulp");
var logLine = require("gulp-log-line");

const paths = {
  scripts: {
    src: "server/**/*.js",
    dest: "dist/server/"
  }
};

gulp.task("line-log", function() {
  return gulp
    .src(paths.scripts.src, { buffer: true })
    .pipe(logLine(["console.log", "logger.info"]))
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("default", ["line-log"]);
