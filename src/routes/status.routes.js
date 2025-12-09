const express = require("express");
const router = express.Router();
const DailyEntry = require("../models/DailyEntry");

router.get("/today", async (req, res) => {
  // Fecha de hoy (sin hora)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const entries = await DailyEntry.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  const usersCheckedIn = new Set(entries.map(e => e.user));

  res.json({
    today: today.toISOString().slice(0, 10),
    nicolas: usersCheckedIn.has("nicolas"),
    kely: usersCheckedIn.has("kely"),
  });
});

module.exports = router;
