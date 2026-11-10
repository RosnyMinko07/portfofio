// services/seen-jobs-manager.js
// Gestionnaire d'historique anti-doublon pour les offres d'emploi au Gabon
const fs = require('fs');
const path = require('path');

const SEEN_JOBS_FILE = path.resolve(__dirname, '..', 'seen_jobs.json');
const TMP_SEEN_FILE = path.join('/tmp', 'seen_jobs.json');

/**
 * Génère une clé unique pour une offre
 */
function getJobKey(job) {
  if (job.id && !job.id.startsWith('MOCK')) {
    return String(job.id).trim().toLowerCase();
  }
  const cleanTitle = (job.titre || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanComp = (job.entreprise || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}_${cleanComp}`;
}

/**
 * Charge l'ensemble des IDs d'offres déjà vues
 */
function loadSeenJobs() {
  const seenMap = {};

  // 1. Essayer le fichier racine du projet
  try {
    if (fs.existsSync(SEEN_JOBS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SEEN_JOBS_FILE, 'utf-8'));
      Object.assign(seenMap, data);
    }
  } catch (e) {
    //
  }

  // 2. Si sur Vercel (/tmp)
  try {
    if (fs.existsSync(TMP_SEEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TMP_SEEN_FILE, 'utf-8'));
      Object.assign(seenMap, data);
    }
  } catch (e) {
    //
  }

  return seenMap;
}

/**
 * Marque les offres avec isNew = true ou false
 */
function tagJobsWithHistory(analyzedJobs) {
  const seenMap = loadSeenJobs();
  const now = new Date().toISOString();

  return analyzedJobs.map(item => {
    const key = getJobKey(item.job);
    const existing = seenMap[key];

    const isNew = !existing;
    const firstSeen = existing ? existing.firstSeen : now;

    return {
      ...item,
      job: {
        ...item.job,
        key,
        isNew,
        firstSeen
      }
    };
  });
}

/**
 * Sauvegarde les nouvelles offres dans l'historique
 */
function markJobsAsSeen(analyzedJobs) {
  const seenMap = loadSeenJobs();
  const now = new Date().toISOString();

  let addedCount = 0;
  analyzedJobs.forEach(item => {
    const key = item.job.key || getJobKey(item.job);
    if (!seenMap[key]) {
      seenMap[key] = {
        id: item.job.id,
        titre: item.job.titre,
        entreprise: item.job.entreprise,
        firstSeen: now,
        score: item.analysis?.score || 0
      };
      addedCount++;
    }
  });

  // Sauvegarder sur disque local si possible
  try {
    fs.writeFileSync(SEEN_JOBS_FILE, JSON.stringify(seenMap, null, 2), 'utf-8');
  } catch (e) {
    // Vercel serverless read-only
  }

  // Sauvegarder dans /tmp (sur Vercel)
  try {
    fs.writeFileSync(TMP_SEEN_FILE, JSON.stringify(seenMap, null, 2), 'utf-8');
  } catch (e) {
    //
  }

  return { totalSeen: Object.keys(seenMap).length, newlyAdded: addedCount };
}

module.exports = {
  getJobKey,
  loadSeenJobs,
  tagJobsWithHistory,
  markJobsAsSeen
};

