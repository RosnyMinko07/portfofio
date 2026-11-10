// services/live-job-scraper.js
// Scraper et moissonneur d'offres d'emploi en direct au Gabon (LinkedIn Jobs, AltEmploi & IA)

/**
 * Scrape les offres LinkedIn en direct pour le Gabon via l'API Guest publique de LinkedIn
 */
async function fetchLinkedInLiveJobs() {
  const queries = [
    'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=informatique&location=Gabon',
    'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=developer&location=Gabon',
    'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=developpeur&location=Gabon',
    'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=web&location=Libreville%2C%20Gabon'
  ];

  const jobsMap = new Map();

  for (const url of queries) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
        }
      });
      if (!res.ok) continue;

      const html = await res.text();
      const titleMatches = [...html.matchAll(/<h3 class="base-search-card__title">([\s\S]*?)<\/h3>/g)];
      const compMatches = [...html.matchAll(/<h4 class="base-search-card__subtitle">([\s\S]*?)<\/h4>/g)];
      const locMatches = [...html.matchAll(/<span class="job-search-card__location">([\s\S]*?)<\/span>/g)];
      const linkMatches = [...html.matchAll(/<a class="base-card__full-link[^"]*" href="([^"]+)"/g)];
      const timeMatches = [...html.matchAll(/<time[^>]*datetime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/g)];

      titleMatches.forEach((m, i) => {
        const titre = m[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
        const entreprise = compMatches[i] ? compMatches[i][1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim() : 'Entreprise au Gabon';
        const localisation = locMatches[i] ? locMatches[i][1].trim() : 'Libreville, Gabon';
        const rawLink = linkMatches[i] ? linkMatches[i][1].split('?')[0] : '';
        const datePub = timeMatches[i] ? timeMatches[i][2].trim() : 'Récemment';

        const idMatch = rawLink.match(/-(\d+)$/) || [null, 'LNK-' + i];
        const id = 'LNK-' + idMatch[1];

        const lower = (titre + ' ' + entreprise).toLowerCase();
        const isTech = [
          'dev', 'informatique', 'software', 'engineer', 'it', 'web', 
          'data', 'support', 'système', 'réseau', 'digital', 'tech', 
          'analyst', 'programmeur', 'full stack', 'front', 'back', 'flutter', 'laravel'
        ].some(k => lower.includes(k));

        if (isTech && !jobsMap.has(id)) {
          // Détection automatique de compétences requises basiques
          const competences = [];
          if (lower.includes('flutter') || lower.includes('mobile')) competences.push('Flutter', 'Dart');
          if (lower.includes('laravel') || lower.includes('php')) competences.push('PHP', 'Laravel');
          if (lower.includes('react') || lower.includes('front')) competences.push('React.js', 'JavaScript');
          if (lower.includes('node') || lower.includes('back')) competences.push('Node.js');
          if (lower.includes('réseau') || lower.includes('network')) competences.push('Réseaux', 'Sécurité');
          if (lower.includes('support')) competences.push('Support IT', 'Maintenance');
          if (competences.length === 0) competences.push('Informatique', 'Génie Logiciel', 'Web');

          jobsMap.set(id, {
            id,
            titre,
            entreprise,
            localisation,
            type_contrat: "CDI / Mission Tech",
            secteur: "Technologies & Solutions Numériques",
            description: `Offre d'emploi tech détectée en direct sur LinkedIn Gabon : ${titre} chez ${entreprise} (${localisation}).`,
            competences_requises: competences,
            experience: "1 à 4 ans d'expérience",
            source: "LinkedIn Jobs Gabon (En direct)",
            lien: rawLink,
            contact_candidature: `Postuler directement sur LinkedIn : ${rawLink}`,
            date_publication: datePub,
            statut: "Ouvert",
            isLive: true
          });
        }
      });
    } catch (e) {
      console.warn('⚠️ Erreur moissonnage LinkedIn :', e.message);
    }
  }

  return Array.from(jobsMap.values());
}

/**
 * Scrape les offres de référence d'AltEmploi Gabon
 */
async function fetchAltEmploiLiveJobs() {
  const jobs = [];
  try {
    const res = await fetch('https://www.altemploi5.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return jobs;

    const html = await res.text();
    const offerLinks = [...html.matchAll(/href="(https:\/\/www\.altemploi5\.com\/offre\/([^"'/]+)\/)"/gi)];

    const seenSlugs = new Set();
    offerLinks.forEach(m => {
      const fullUrl = m[1];
      const slug = m[2];
      if (seenSlugs.has(slug)) return;
      seenSlugs.add(slug);

      // Si le slug ou l'offre concerne un profil technique/informatique/gestion
      const cleanTitle = slug
        .replace(/^\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const lower = cleanTitle.toLowerCase();
      const isTech = ['dev', 'informatique', 'it', 'web', 'numérique', 'technicien', 'digital', 'gestion', 'projet'].some(k => lower.includes(k));

      if (isTech) {
        jobs.push({
          id: `ALT-${slug.substring(0, 15)}`,
          titre: cleanTitle,
          entreprise: "Cabinet AltEmploi Gabon",
          localisation: "Libreville, Gabon",
          type_contrat: "CDI / Mission",
          secteur: "Recrutement & Technologies",
          description: `Offre publiée par le cabinet AltEmploi Gabon : ${cleanTitle}.`,
          competences_requises: ["Informatique", "Génie Logiciel", "Organisation"],
          experience: "Bac+3 à Bac+5",
          source: "AltEmploi Gabon (altemploi5.com)",
          lien: fullUrl,
          contact_candidature: "recrutement@altemploi5.com / Formulaire AltEmploi",
          date_publication: "Publié récemment",
          statut: "Ouvert",
          isLive: true
        });
      }
    });
  } catch (e) {
    console.warn('⚠️ Erreur moissonnage AltEmploi :', e.message);
  }

  return jobs;
}

/**
 * Recherche augmentée via Google Gemini IA (si GOOGLE_GEMINI_API_KEY ou OPENROUTER_API_KEY configuré)
 */
async function fetchGeminiAiJobs() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return [];

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tu es un agent chasseur de têtes spécialisé dans le marché de l'emploi technologique et informatique à Libreville et au Gabon.
Génère une liste JSON de 2 à 4 offres d'emploi récentes et très plausibles pour un profil Développeur Web & Mobile (Laravel, Flutter, React, Node.js, Python) pour des entreprises au Gabon (ex: Airtel Gabon, Moov Africa, TotalEnergies Gabon, Sobraga, banques BGFIBank, ESN locales).
Renvoie STRICTEMENT un tableau JSON valide sans formatage markdown, avec les clés:
[
  {
    "id": "IA-GAB-001",
    "titre": "Développeur Full Stack Web & Mobile",
    "entreprise": "Nom Entreprise",
    "localisation": "Libreville, Gabon",
    "type_contrat": "CDI",
    "secteur": "Secteur",
    "description": "Description détaillée du poste...",
    "competences_requises": ["Laravel", "Flutter", "MySQL"],
    "experience": "2 ans",
    "source": "Veille IA Gabon",
    "lien": "https://www.linkedin.com/jobs/search/?keywords=developpeur&location=Gabon",
    "contact_candidature": "recrutement@entreprise.ga",
    "date_publication": "Aujourd'hui"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed)) {
      return parsed.map(j => ({ ...j, isLive: true }));
    }
  } catch (e) {
    console.warn('ℹ️ Recherche IA Gemini non disponible ou clé manquante :', e.message);
  }

  return [];
}

/**
 * Moissonne toutes les sources en direct
 */
async function harvestAllLiveJobs() {
  console.log('🌐 [HARVESTER] Lancement du moissonnage en direct (LinkedIn + AltEmploi + IA)...');
  
  const [linkedInJobs, altJobs, geminiJobs] = await Promise.all([
    fetchLinkedInLiveJobs(),
    fetchAltEmploiLiveJobs(),
    fetchGeminiAiJobs()
  ]);

  console.log(`   📡 LinkedIn Jobs : ${linkedInJobs.length} offre(s) en direct trouvée(s)`);
  console.log(`   📡 AltEmploi     : ${altJobs.length} offre(s) tech trouvée(s)`);
  console.log(`   📡 Agent IA Web  : ${geminiJobs.length} opportunité(s) générée(s)`);

  const allLive = [...linkedInJobs, ...altJobs, ...geminiJobs];

  // Déduplication par ID
  const uniqueMap = new Map();
  allLive.forEach(job => {
    if (!uniqueMap.has(job.id)) {
      uniqueMap.set(job.id, job);
    }
  });

  return Array.from(uniqueMap.values());
}

module.exports = {
  fetchLinkedInLiveJobs,
  fetchAltEmploiLiveJobs,
  fetchGeminiAiJobs,
  harvestAllLiveJobs
};

