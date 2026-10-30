
const API_URL = "https://football-pronos.onrender.com/api/fixtures";

const regionSelect = document.getElementById("region");
const marketSelect = document.getElementById("market");
const matchesContainer = document.getElementById("matches");
const statusMessage = document.getElementById("status");

let realMatches = [];

const africanCountries = [
  "burkina faso", "mali", "senegal", "cote d'ivoire",
  "ivory coast", "ghana", "nigeria", "cameroon",
  "morocco", "algeria", "tunisia", "egypt",
  "south africa", "guinea", "togo", "benin",
  "niger", "gabon", "congo", "rd congo",
  "democratic republic of the congo", "angola",
  "zambia", "uganda", "kenya", "tanzania",
  "ethiopia", "rwanda", "mozambique", "zimbabwe"
];

const europeanCountries = [
  "france", "england", "spain", "germany", "italy",
  "portugal", "netherlands", "belgium", "switzerland",
  "austria", "scotland", "ireland", "wales",
  "turkey", "greece", "croatia", "serbia",
  "poland", "ukraine", "denmark", "sweden",
  "norway", "finland", "czech republic", "romania"
];

function getRegion(country, leagueName) {
  const normalized = (country || "").toLowerCase().trim();

  if (africanCountries.includes(normalized)) return "afrique";
  if (europeanCountries.includes(normalized)) return "europe";

  if (
    normalized.includes("world") ||
    normalized.includes("international") ||
    normalized.includes("world cup")
  ) return "international";

  if (
    (leagueName || "").toLowerCase().includes("world") ||
    (leagueName || "").toLowerCase().includes("international")
  ) return "international";

  return "international";
}

function formatDate(date) {
  if (!date) return "Date non disponible";

  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderMatches() {
  const region = regionSelect.value;
  const market = marketSelect.value;

  const filteredMatches = realMatches.filter((match) => {
    return region === "tous" || match.region === region;
  });

  matchesContainer.replaceChildren();

  if (filteredMatches.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun match disponible pour cette région.";
    matchesContainer.appendChild(message);
    return;
  }

  filteredMatches.forEach((match) => {
    const card = document.createElement("article");
    card.className = "match-card";

    const competition = document.createElement("p");
    competition.className = "competition";
    competition.textContent =
      `${match.competition} · ${match.country}`;

    const teams = document.createElement("div");
    teams.className = "teams";

    const home = document.createElement("span");
    home.textContent = match.home;

    const versus = document.createElement("span");
    versus.className = "versus";
    versus.textContent = "VS";

    const away = document.createElement("span");
    away.textContent = match.away;

    teams.append(home, versus, away);

    const date = document.createElement("p");
    date.className = "competition";
    date.textContent = formatDate(match.date);

    const status = document.createElement("p");
    status.className = "market";
    status.textContent =
      match.status === "NS"
        ? "À venir · Analyse spécialisée à préparer"
        : `Statut : ${match.status}`;

    const selectedMarket = document.createElement("p");
    selectedMarket.className = "market";

    const marketLabels = {
      tous: "Tous les marchés",
      "1n2": "Marché 1N2",
      buts: "Marché des buts",
      btts: "Les deux équipes marquent"
    };

    selectedMarket.textContent =
      marketLabels[market] || "Marché sélectionné";

    card.append(competition, teams, date, status, selectedMarket);
    matchesContainer.appendChild(card);
  });
}

async function loadMatches() {
  statusMessage.textContent = "Chargement des rencontres réelles...";

  matchesContainer.replaceChildren();

  try {
    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    const response = await fetch(
      `${API_URL}?date=${encodeURIComponent(date)}`
    );

    if (!response.ok) {
      throw new Error(`Erreur serveur : ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.response)) {
      throw new Error("Format de réponse API incorrect.");
    }

    realMatches = data.response.map((item) => ({
      home: item.teams?.home?.name || "Équipe inconnue",
      away: item.teams?.away?.name || "Équipe inconnue",
      competition: item.league?.name || "Compétition inconnue",
      country: item.league?.country || "International",
      date: item.fixture?.date,
      status: item.fixture?.status?.short || "NS",
      region: getRegion(
        item.league?.country,
        item.league?.name
      )
    }));

    statusMessage.textContent =
      `${data.results || realMatches.length} rencontre(s) trouvée(s) pour le ${date}.`;

    renderMatches();

  } catch (error) {
    console.error(error);

    statusMessage.textContent =
      "Impossible de charger les rencontres. Réessaie dans quelques instants.";

    const message = document.createElement("p");
    message.textContent = error.message;
    matchesContainer.appendChild(message);
  }
}

regionSelect.addEventListener("change", renderMatches);
marketSelect.addEventListener("change", renderMatches);

loadMatches();
      
