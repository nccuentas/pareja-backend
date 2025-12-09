const express = require("express");
const router = express.Router();
const DailyEntry = require("../models/DailyEntry");

function average(arr, key) {
  if (!arr.length) return null;
  return arr.reduce((s, e) => s + (e[key] || 0), 0) / arr.length;
}

function toPercent(val) {
  if (val === null) return null;
  return Math.round((val / 5) * 100);
}

function buildPersonalReview(entries) {
  if (!entries.length) {
    return {
      percentages: null,
      text: [],
    };
  }

  const f = average(entries, "feelings");
  const c = average(entries, "communication");
  const t = average(entries, "trust");
  const discomfortCount = entries.filter(e => e.discomfort).length;

  let lines = [];

  // Estado emocional
  if (f >= 4) {
    lines.push("Mostró un buen estado emocional general.");
  } else if (f >= 3) {
    lines.push("Tuvo un estado emocional variable durante la semana.");
  } else {
    lines.push("Se percibe un estado emocional más bajo esta semana.");
  }

  // Comunicación
  if (c >= 4) {
    lines.push("La comunicación se mantuvo fluida y clara.");
  } else if (c >= 3) {
    lines.push("La comunicación fue aceptable, aunque con altibajos.");
  } else {
    lines.push("Hubo dificultades para expresar lo que sentía.");
  }

  // Confianza
  if (t >= 4) {
    lines.push("Se percibe tranquilidad y confianza en la relación.");
  } else if (t >= 3) {
    lines.push("La confianza estuvo presente, aunque con algunas dudas.");
  } else {
    lines.push("Aparecieron inseguridades que pueden ser importantes hablar.");
  }

  // Incomodidades
  if (discomfortCount >= 3) {
    lines.push("Se presentaron varias incomodidades a lo largo de la semana.");
  } else if (discomfortCount > 0) {
    lines.push("Hubo momentos puntuales de incomodidad.");
  }

  return {
    percentages: {
      feelings: toPercent(f),
      communication: toPercent(c),
      trust: toPercent(t),
    },
    text: lines,
  };
}

router.get("/", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const entries = await DailyEntry.find({
      createdAt: { $gte: since },
    }).sort({ createdAt: 1 });

    if (!entries.length) {
      return res.json({ message: "Aún no hay datos suficientes esta semana." });
    }

    const nicolasEntries = entries.filter(e => e.user === "nicolas");
    const kelyEntries = entries.filter(e => e.user === "kely");

    const nReview = buildPersonalReview(nicolasEntries);
    const kReview = buildPersonalReview(kelyEntries);

    // ✅ RECOLECTAR NOTAS LITERALES
    const literalNotes = {
      nicolas: [],
      kely: [],
    };

    entries.forEach(e => {
      if (e.notes && e.notes.trim() !== "") {
        literalNotes[e.user].push({
          date: e.createdAt.toISOString().split("T")[0],
          note: e.notes,
        });
      }
    });

    res.json({
      nicolas: {
        ...nReview,
        notes: literalNotes.nicolas,
      },
      kely: {
        ...kReview,
        notes: literalNotes.kely,
      },
      suggestion:
        "Usen este resumen como punto de partida para conversar con calma y respeto.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando resumen semanal" });
  }
});

module.exports = router;
