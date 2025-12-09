const mongoose = require("mongoose");

const DailyEntrySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      enum: ["nicolas", "kely"],
      required: true,
    },

    // ✅ FECHA LÓGICA DEL CHECK-IN (Colombia)
    // Se guarda como string YYYY-MM-DD
    // Se calcula en la ruta, NO aquí
    date: {
      type: String,
      required: true,
      index: true, // ✅ importante para status/today
    },

    feelings: {
      type: Number,
      min: 1,
      max: 5,
    },

    communication: {
      type: Number,
      min: 1,
      max: 5,
    },

    trust: {
      type: Number,
      min: 1,
      max: 5,
    },

    discomfort: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ solo para logs (createdAt / updatedAt)
  }
);

module.exports = mongoose.model("DailyEntry", DailyEntrySchema);
