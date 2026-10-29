
const demoMatches = [
  {
    home: "Équipe Europe A",
    away: "Équipe Europe B",
    competition: "Europe · Exemple fictif",
    region: "europe",
    market: "1n2",
    marketLabel: "Analyse 1N2 à venir"
  },
  {
    home: "Équipe Afrique A",
    away: "Équipe Afrique B",
    competition: "Afrique · Exemple fictif",
    region: "afrique",
    market: "buts",
    marketLabel: "Analyse des buts à venir"
  },
  {
    home: "Sélection A",
    away: "Sélection B",
    competition: "International · Exemple fictif",
    region: "international",
    market: "btts",
    marketLabel: "Les deux équipes marquent : à étudier"
  }
];

const regionSelect = document.getElementById("region");
const marketSelect = document.getElementById("market");
const matchesContainer = document.getElementById("matches");
const statusMessage = document.getElementById("status");

function renderMatches() {
  const region = regionSelect.value;
  const market = marketSelect.value;

  const filteredMatches = demoMatches.filter((match) => {
    const regionMatches =
      region === "tous" || match.region === region;

    const marketMatches =
      market === "tous" || match.market === market;

    return regionMatches && marketMatches;
  });

  matchesContainer.replaceChildren();

  if (filteredMatches.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun exemple ne correspond à ces filtres.";
    matchesContainer.appendChild(message);
    return;
  }

  filteredMatches.forEach((match) => {
    const card = document.createElement("article");
    card.className = "match-card";

    const competition = document.createElement("p");
    competition.className = "competition";
    competition.textContent = match.competition;

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

    const market = document.createElement("span");
    market.className = "market";
    market.textContent = match.marketLabel;

    card.append(competition, teams, market);
    matchesContainer.appendChild(card);
  });
}

regionSelect.addEventListener("change", renderMatches);
marketSelect.addEventListener("change", renderMatches);

renderMatches();
