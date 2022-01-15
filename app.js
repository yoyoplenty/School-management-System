var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var classRouter = require("./routes/class");
var subjectRouter = require("./routes/subjects");

var app = express();
//Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/class", classRouter);
app.use("/subjects", subjectRouter);

module.exports = app;
