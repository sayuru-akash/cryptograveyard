import { graveyardEntries } from "./data.js";

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const timeline = document.getElementById("timeline");

const formatDate = (value) => {
  const [month, ...rest] = value.split(/\s+/);
  return `<span>${month}</span><span>${rest.join(" ")}</span>`;
};

const buildCard = (entry) => {
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.kind = entry.kind;
  article.dataset.search =
    `${entry.title} ${entry.date} ${entry.description} ${entry.kind}`.toLowerCase();

  article.innerHTML = `
    <span class="card-icon" aria-hidden="true"></span>
    <a target="_blank" rel="noreferrer" href="${entry.url}"><span class="heading">${entry.title}</span></a>
    <p class="date">${formatDate(entry.date)}</p>
    <p>${entry.description}</p>
    <span class="kind-badge" aria-hidden="true">${entry.kind}</span>
  `;

  return article;
};

const renderTimeline = (entries) => {
  timeline.replaceChildren(...entries.map(buildCard));
};

const populateFilter = (entries) => {
  const counts = entries.reduce((accumulator, entry) => {
    accumulator[entry.kind] = (accumulator[entry.kind] ?? 0) + 1;
    return accumulator;
  }, {});

  const kinds = Object.entries(counts).sort(
    (left, right) => right[1] - left[1],
  );
  categoryFilter.innerHTML = [
    `<option value="all">All (${entries.length})</option>`,
    ...kinds.map(
      ([kind, count]) => `<option value="${kind}">${kind} (${count})</option>`,
    ),
  ].join("");
};

const applyFilters = () => {
  const term = searchInput.value.trim().toLowerCase();
  const selectedKind = categoryFilter.value;

  timeline.querySelectorAll(".card").forEach((card) => {
    const matchesSearch = !term || card.dataset.search.includes(term);
    const matchesKind =
      selectedKind === "all" || card.dataset.kind === selectedKind;
    card.hidden = !(matchesSearch && matchesKind);
  });
};

const loadTimeline = () => {
  renderTimeline(graveyardEntries);
  populateFilter(graveyardEntries);
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  applyFilters();
};

loadTimeline();
