// services/job-ai-analyzer.js
// Analyse des offres pour Rosny : pertinence par rapport au profil + résumé court.
// - Avec OPENROUTER_API_KEY : analyse par IA (modèle OPENROUTER_MODEL, DeepSeek V3 par défaut).
// - Sans clé, ou si l'IA échoue : tri par mots-clés et résumé = début de la description.
// L'IA ne fait que résumer et classer des offres réelles ; elle ne crée aucune offre.

// Profil envoyé à l'IA (aucune donnée de contact)
const PROFILE_SUMMARY = `Développeur Full Stack Web & Mobile, basé à Libreville (Gabon).
Formation : Licence Pro Génie Logiciel (INPTIC) + Master Intelligence Artificielle en cours.
Compétences : PHP/Laravel, Node.js/Express, Python (Django, FastAPI), JavaScript/TypeScript, React, Vue.js,
Flutter/Dart, Android, MySQL, PostgreSQL, MongoDB, Firebase, Git, Docker, Linux, API REST, WinDev, sécurité web,
administration réseau et bases de données, maintenance informatique, solutions d'IA.
Expérience : freelance et missions full-stack depuis 2023 (gestion hôtelière, streaming, facturation/stock).
Recherche : CDI, CDD, freelance ou consultant, de préférence au Gabon.`;

const LEVELS = ['forte', 'moyenne', 'faible'];

// ---------- Repli sans IA : mots-clés ----------

const STRONG_KEYWORDS = [
  'développeur', 'developpeur', 'developer', 'développement', 'full stack', 'fullstack', 'full-stack',
  'informatique', 'informaticien', 'logiciel', 'software', 'web', 'mobile', 'flutter', 'laravel', 'php',
  'javascript', 'react', 'node', 'python', 'data', 'devops', 'base de données', 'dba', 'réseau', 'système',
  'it', 'digital', 'numérique', 'intelligence artificielle', 'ia', 'cybersécurité', 'sécurité informatique'
];
const MEDIUM_KEYWORDS = [
  'technicien', 'support', 'helpdesk', 'maintenance', 'télécom', 'telecom', 'analyste', 'ingénieur',
  'chef de projet', 'project manager', 'transformation', 'erp', 'sap', 'odoo', 'sage',
  'bi', 'business intelligence', 'consultant fonctionnel'
];

function normalize(s = '') {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Recherche par mot entier : "it" ne doit pas correspondre à "profit"
const toRegex = k => new RegExp('(^|[^a-z0-9])' + normalize(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9])');
const STRONG_RE = STRONG_KEYWORDS.map(toRegex);
const MEDIUM_RE = MEDIUM_KEYWORDS.map(toRegex);

function keywordLevel(job) {
  const title = normalize(job.titre);
  const all = normalize(job.titre + ' ' + (job.description || ''));
  if (STRONG_RE.some(re => re.test(title))) return 'forte';
  if (MEDIUM_RE.some(re => re.test(title))) return 'moyenne';
  // Mention technique seulement dans le texte : au mieux "moyenne"
  const strongInText = STRONG_RE.filter(re => re.test(all)).length;
  return strongInText >= 2 ? 'moyenne' : 'faible';
}

function fallbackSummary(job) {
  const text = (job.description || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > 280 ? text.slice(0, 277).replace(/\s\S*$/, '') + '…' : text;
}

function fallbackAnalysis(job) {
  return {
    pertinence: keywordLevel(job),
    raison: '',
    missions: fallbackSummary(job),
    profil: '',
    dateLimite: job.dateLimite || '',
    candidature: '',
    parIA: false
  };
}

// ---------- Analyse IA (OpenRouter) ----------

const BATCH_SIZE = 8;

function buildPrompt(jobs) {
  const offers = jobs.map((j, i) => ({
    n: i,
    titre: j.titre,
    entreprise: j.entreprise,
    lieu: j.localisation,
    contrat: j.contrat,
    texte: (j.description || '').slice(0, 1800)
  }));
  return `Profil du candidat :
${PROFILE_SUMMARY}

Voici ${jobs.length} offres d'emploi réelles publiées au Gabon (JSON) :
${JSON.stringify(offers)}

Pour CHAQUE offre, réponds en français, uniquement à partir du texte fourni (n'invente rien ; si une information est absente, mets "") :
- "pertinence" : "forte" si le poste correspond directement au profil (développement, informatique, data, réseau, IA…), "moyenne" s'il est lié en partie (technique, numérique, gestion de projet IT…), "faible" sinon.
- "raison" : 1 phrase courte expliquant la pertinence pour ce candidat.
- "missions" : les missions principales en 1 à 2 phrases.
- "profil" : le profil demandé (diplôme, expérience, compétences) en 1 phrase.
- "dateLimite" : la date limite de candidature si elle est indiquée, sinon "".
- "candidature" : comment postuler (email, lien, dossier) si c'est indiqué, sinon "".

Réponds UNIQUEMENT avec un tableau JSON, sans texte autour, de la forme :
[{"n":0,"pertinence":"forte","raison":"...","missions":"...","profil":"...","dateLimite":"","candidature":""}]`;
}

function parseJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('réponse IA sans tableau JSON');
  return JSON.parse(text.slice(start, end + 1));
}

async function analyzeBatchWithAI(jobs, apiKey) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Veille emploi Gabon'
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
      temperature: 0.2,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: "Tu es un assistant de recrutement précis. Tu résumes et classes des offres d'emploi réelles sans jamais inventer d'information." },
        { role: 'user', content: buildPrompt(jobs) }
      ]
    }),
    signal: AbortSignal.timeout(90000)
  });
  if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status} : ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  const items = parseJsonArray(content);

  const str = v => (typeof v === 'string' ? v.trim() : '');
  return jobs.map((job, i) => {
    const item = items.find(x => Number(x.n) === i);
    if (!item) return fallbackAnalysis(job);
    return {
      pertinence: LEVELS.includes(item.pertinence) ? item.pertinence : keywordLevel(job),
      raison: str(item.raison),
      missions: str(item.missions) || fallbackSummary(job),
      profil: str(item.profil),
      dateLimite: str(item.dateLimite) || job.dateLimite || '',
      candidature: str(item.candidature),
      parIA: true
    };
  });
}

/**
 * Renvoie les offres enrichies d'un champ "analyse", triées par pertinence (forte → faible).
 */
async function analyzeJobs(jobs) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const analyses = [];

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    if (apiKey) {
      try {
        analyses.push(...(await analyzeBatchWithAI(batch, apiKey)));
        continue;
      } catch (e) {
        console.warn('Analyse IA indisponible, tri par mots-clés :', e.message);
      }
    }
    analyses.push(...batch.map(fallbackAnalysis));
  }

  return jobs
    .map((job, i) => ({ ...job, analyse: analyses[i] }))
    .sort((a, b) => LEVELS.indexOf(a.analyse.pertinence) - LEVELS.indexOf(b.analyse.pertinence));
}

module.exports = { analyzeJobs, keywordLevel, LEVELS };
