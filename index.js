let express = require("express");
let app = require("express")();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const http = require("http").createServer(app);
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var session = require("express-session");
const MongoStore = require('connect-mongo');
const config = require("./config");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const limiter = rateLimit({
  windowMs: 60,
  max: config.reqPerMinute
});
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

app.set("trust proxy", 1);
let corsOptions = {
  origin: function(origin, callback) {
    if (config.whiteList.indexOf(origin) > -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();      
}); 

// view engine setup
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

var session = require("express-session");

app.use(
  session({
    key: "connect.sid",
    secret: "weliveinabeautifulworld",
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: MongoStore.create({ mongoUrl: config.mongoConnection })
    ,
  })
); // session secret
app.use("/", require("./routes/index"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(function(req, res, next) {
  res.sendStatus(404);
});

http.listen(config.port, function() {
  console.log("listening on *: ", config.port);
});
