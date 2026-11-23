// services/gabon-job-sources.js
// Récupère les VRAIES offres d'emploi publiées au Gabon (tous secteurs) sur plusieurs plateformes.
// Aucune offre n'est inventée : si une plateforme ne répond pas, elle est simplement ignorée.

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8' },
    signal: AbortSignal.timeout(25000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function decodeHtml(str = '') {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * emploi.ga — principal site d'emploi du Gabon (tous secteurs).
 * Les offres les plus récentes sont en premier.
 */
async function fetchEmploiGa(pages = 2) {
  const jobs = [];
  for (let page = 0; page < pages; page++) {
    const url = 'https://www.emploi.ga/recherche-jobs-gabon' + (page > 0 ? `?page=${page}` : '');
    const html = await fetchHtml(url);
    const cards = html.split('class="card card-job"').slice(1);
    for (const card of cards) {
      const link = card.match(/<h3><a href="(\/offre-emploi-gabon\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      if (!link) continue;
      const idMatch = link[1].match(/-(\d+)$/);
      jobs.push({
        id: 'EMPLOIGA-' + (idMatch ? idMatch[1] : link[1]),
        titre: decodeHtml(link[2]),
        entreprise: decodeHtml((card.match(/class="card-job-company company-name">([\s\S]*?)<\/a>/) || [])[1]) || 'Non précisée',
        localisation: decodeHtml((card.match(/Région de : <strong>([\s\S]*?)<\/strong>/) || [])[1]) || 'Gabon',
        contrat: decodeHtml((card.match(/Contrat proposé\s*:\s*<strong>([\s\S]*?)<\/strong>/) || [])[1]),
        date: (card.match(/<time datetime="([^"]+)"/) || [])[1] || '',
        source: 'emploi.ga',
        lien: 'https://www.emploi.ga' + link[1]
      });
    }
  }
  return jobs;
}

/**
 * Jobartis Gabon — dernières offres affichées en page d'accueil.
 */
async function fetchJobartis() {
  const html = await fetchHtml('https://www.jobartis.ga/');
  const jobs = [];
  const re = /<a class="[^"]*" href="(\/emploi-[^"]+)"><div class="top_job row">([\s\S]*?)<\/a>/g;
  for (const m of html.matchAll(re)) {
    const block = m[2];
    const details = [...block.matchAll(/<small>([\s\S]*?)<\/small>/g)].map(x => decodeHtml(x[1]));
    jobs.push({
      id: 'JOBARTIS-' + m[1].replace(/^\/emploi-/, ''),
      titre: decodeHtml((block.match(/<h5>([\s\S]*?)<\/h5>/) || [])[1]),
      entreprise: details[0] || 'Non précisée',
      localisation: details[1] || '',
      contrat: '',
      date: '',
      source: 'Jobartis Gabon',
      lien: 'https://www.jobartis.ga' + m[1]
    });
  }
  // Jobartis publie aussi des offres à l'étranger : on ne garde que le Gabon
  return jobs.filter(j => j.titre && isInGabon(j.localisation));
}

const GABON_PLACES = [
  'gabon', 'estuaire', 'haut-ogooue', 'moyen-ogooue', 'ngounie', 'nyanga', 'ogooue-ivindo',
  'ogooue-lolo', 'ogooue-maritime', 'woleu-ntem', 'libreville', 'port-gentil', 'franceville',
  'oyem', 'moanda', 'lambarene', 'mouila', 'tchibanga', 'koulamoutou', 'makokou', 'bitam',
  'owendo', 'akanda', 'ntoum', 'gamba', 'lastoursville', 'okondja'
];

function isInGabon(location = '') {
  const norm = location.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
  return GABON_PLACES.some(p => norm.includes(p));
}

/**
 * LinkedIn — offres publiées au Gabon ces dernières 24 h (API publique "guest").
 * LinkedIn limite souvent ces requêtes (HTTP 429) : la source est alors ignorée pour ce passage.
 */
async function fetchLinkedIn(pages = 2) {
  const jobs = [];
  for (let page = 0; page < pages; page++) {
    const url =
      'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search' +
      `?location=Gabon&f_TPR=r86400&sortBy=DD&start=${page * 25}`;
    const html = await fetchHtml(url);
    const cards = html.split('<li>').slice(1);
    if (cards.length === 0) break;
    for (const card of cards) {
      const link = (card.match(/class="base-card__full-link[^"]*"\s+href="([^"]+)"/) || [])[1];
      const titre = decodeHtml((card.match(/<h3 class="base-search-card__title">([\s\S]*?)<\/h3>/) || [])[1]);
      if (!link || !titre) continue;
      const cleanLink = link.split('?')[0];
      const idMatch = cleanLink.match(/-(\d+)$/) || (card.match(/urn:li:jobPosting:(\d+)/) || []);
      jobs.push({
        id: 'LINKEDIN-' + (idMatch[1] || cleanLink),
        titre,
        entreprise: decodeHtml((card.match(/<h4 class="base-search-card__subtitle">([\s\S]*?)<\/h4>/) || [])[1]) || 'Non précisée',
        localisation: decodeHtml((card.match(/<span class="job-search-card__location">([\s\S]*?)<\/span>/) || [])[1]) || 'Gabon',
        contrat: '',
        date: (card.match(/<time[^>]*datetime="([^"]+)"/) || [])[1] || '',
        source: 'LinkedIn',
        lien: cleanLink
      });
    }
  }
  return jobs;
}

const SOURCES = [
  { nom: 'emploi.ga', run: () => fetchEmploiGa() },
  { nom: 'Jobartis Gabon', run: () => fetchJobartis() },
  { nom: 'LinkedIn', run: () => fetchLinkedIn() }
];

/**
 * Interroge toutes les plateformes en parallèle.
 * Renvoie les offres dédupliquées et l'état de chaque source.
 */
async function harvestGabonJobs() {
  const results = await Promise.allSettled(SOURCES.map(s => s.run()));
  const status = {};
  const byId = new Map();

  results.forEach((r, i) => {
    const nom = SOURCES[i].nom;
    if (r.status === 'fulfilled') {
      status[nom] = { ok: true, count: r.value.length };
      r.value.forEach(job => { if (!byId.has(job.id)) byId.set(job.id, job); });
    } else {
      status[nom] = { ok: false, error: r.reason?.message || String(r.reason) };
    }
  });

  return { jobs: [...byId.values()], status };
}

module.exports = { harvestGabonJobs, fetchEmploiGa, fetchJobartis, fetchLinkedIn };
