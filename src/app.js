const express = require("express");

// logger requirements
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");

const methodOverride = require("method-override");

const multer = require("multer");

const mount = require("./modulos");

const app = express();

// configures the updaload path
// https://expressjs.com/en/resources/middleware/multer.html
const upload = multer({
  storage: new multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

// enable cors
app.use(cors());

// override with different headers; last one takes precedence
app.use(methodOverride("X-HTTP-Method")); //          Microsoft
app.use(methodOverride("X-HTTP-Method-Override")); // Google/GData
app.use(methodOverride("X-Method-Override")); //      IBM

// configures from where to serve static content
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// create a write stream (in append mode) for logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// compress all responses
app.use(compression());

mount(app);

// naive error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .send(
      process.env.NODE_ENV === "production"
        ? "Ops ocorreu um erro."
        : err.message
    );
});

app.listen(process.env.PORT || 3000);
