const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/daily", require("./routes/daily.routes"));
app.use("/api/weekly", require("./routes/weekly.routes"));

module.exports = app;
