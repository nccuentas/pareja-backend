const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.use("/api/daily", require("./routes/daily.routes"));
app.use("/api/weekly", require("./routes/weekly.routes"));
app.use("/api/status", require("./routes/status.routes"));

module.exports = app;
