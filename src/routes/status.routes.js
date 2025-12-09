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
router.get("/streak/:user", async (req, res) => {
  const { user } = req.params;

  const entries = await DailyEntry
    .find({ user })
    .sort({ date: -1 })
    .select("date");

  if (!entries.length) {
    return res.json({ streak: 0 });
  }

  let streak = 0;
  let currentDate = getTodayColombia();

  for (const entry of entries) {
    if (entry.date === currentDate) {
      streak++;
    } else {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      const prevStr = prev.toISOString().slice(0, 10);

      if (entry.date === prevStr) {
        streak++;
        currentDate = prevStr;
      } else {
        break;
      }
    }
  }

  res.json({ streak });
});
module.exports = router;
