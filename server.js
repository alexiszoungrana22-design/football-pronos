const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_FOOTBALL_KEY;

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://alexiszoungrana22-design.github.io"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Football Pronos API",
    apiKeyConfigured: Boolean(API_KEY)
  });
});

app.get("/api/fixtures", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error: "API_FOOTBALL_KEY non configurée sur Render"
    });
  }

  try {
    const date = req.query.date;
    const params = new URLSearchParams();

    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      params.set("date", date);
    } else {
      params.set("date", new Date().toISOString().slice(0, 10));
    }

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?${params.toString()}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok || (data.errors && Object.keys(data.errors).length)) {
      return res.status(502).json({
        error: "API-Football a refusé la requête",
        details: data.errors || data.message || response.status
      });
    }

    res.json({
      date: params.get("date"),
      results: data.results || 0,
      response: data.response || []
    });

  } catch (error) {
    console.error("Erreur API-Football :", error.message);

    res.status(502).json({
      error: "Impossible de joindre API-Football"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Football Pronos API listening on ${PORT}`);
});
