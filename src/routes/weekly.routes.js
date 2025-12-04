const express = require("express");
const router = express.Router();
const DailyEntry = require("../models/DailyEntry");

function average(arr, key) {
  if (!arr.length) return null;
  return arr.reduce((s, e) => s + (e[key] || 0), 0) / arr.length;
}

function toPercent(val) {
  return Math.round((val / 5) * 100);
}

function buildPersonalReview(user, entries) {
  if (!entries.length) {
    return {
      summary: "No hay suficientes datos esta semana.",
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
    lines.push(
      "Se presentaron varias incomodidades a lo largo de la semana."
    );
  } else if (discomfortCount > 0) {
    lines.push(
      "Hubo momentos puntuales de incomodidad."
    );
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
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const entries = await DailyEntry.find({
    createdAt: { $gte: since },
  });

  if (!entries.length) {
    return res.json({ message: "Aún no hay datos suficientes esta semana." });
  }

  const nicolas = entries.filter(e => e.user === "nicolas");
  const kely = entries.filter(e => e.user === "kely");

  const nReview = buildPersonalReview("nicolas", nicolas);
  const kReview = buildPersonalReview("kely", kely);

  res.json({
    nicolas: nReview,
    kely: kReview,
    suggestion:
      "Usen este resumen como punto de partida para conversar con calma y respeto.",
  });
});

module.exports = router;
