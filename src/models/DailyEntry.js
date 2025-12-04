const mongoose = require("mongoose");

const DailyEntrySchema = new mongoose.Schema({
  user: {
    type: String,
    enum: ["nicolas", "kely"],
    required: true,
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },

  feelings: { type: Number, min: 1, max: 5 },
  communication: { type: Number, min: 1, max: 5 },
  trust: { type: Number, min: 1, max: 5 },

  discomfort: Boolean,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("DailyEntry", DailyEntrySchema);
