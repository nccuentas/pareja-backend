const express = require("express");
const router = express.Router();
const DailyEntry = require("../models/DailyEntry");

router.post("/", async (req, res) => {
  try {
    const entry = await DailyEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: "Datos inválidos" });
  }
});

module.exports = router;
