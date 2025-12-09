const express = require("express");
const router = express.Router();

const DailyEntry = require("../models/DailyEntry");
const { getTodayColombia } = require("../utils/dates");

router.get("/today", async (req, res) => {
  try {
    // ✅ HOY real en Colombia (YYYY-MM-DD)
    const today = getTodayColombia();

    // ✅ Buscamos por la fecha lógica, NO createdAt
    const entries = await DailyEntry.find({ date: today });

    res.json({
      today,
      nicolas: entries.some(e => e.user === "nicolas"),
      kely: entries.some(e => e.user === "kely"),
    });
  } catch (err) {
    console.error("Error in /status/today:", err);
    res.status(500).json({ error: "Failed to get today status" });
  }
});

module.exports = router;
