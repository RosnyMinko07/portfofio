// api/cron-job-hunter.js
// Endpoint Serverless & Cron Job Vercel pour la recherche quotidienne d'emploi au Gabon
// Exécuté automatiquement chaque matin à 8h00 (07h00 UTC) ou déclenchable manuellement

const { runJobHunterAgent } = require('../scripts/job-hunter-gabon');
const { dispatchDailyJobAlerts } = require('../services/notifier');

module.exports = async (req, res) => {
  // En-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérification optionnelle de sécurité pour les appels Vercel Cron
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && req.headers['x-vercel-cron'] !== '1') {
    // Si un secret est défini mais non fourni (protection en production si souhaitée)
    console.warn('⚠️ Avertissement d\'authentification Cron Secret');
  }

  try {
    console.log('⏰ [CRON 8H00] Démarrage du job automatique de recherche d\'emploi au Gabon...');

    // 1. Exécuter le système multi-agents
    const result = await runJobHunterAgent();

    // 2. Déclencher les alertes Email + WhatsApp
    const dispatchResults = await dispatchDailyJobAlerts(result.profile, result.analyzedJobs);

    // 3. Réponse JSON complète
    return res.status(200).json({
      success: true,
      message: 'Workflow multi-agents exécuté et alertes expédiées avec succès !',
      executedAt: new Date().toISOString(),
      candidat: result.profile.nom,
      totalOffres: result.analyzedJobs.length,
      topOffres: result.analyzedJobs.slice(0, 3).map(item => ({
        id: item.job.id,
        titre: item.job.titre,
        entreprise: item.job.entreprise,
        matchScore: `${item.analysis.score}%`,
        lien: item.job.lien
      })),
      notifications: dispatchResults
    });

  } catch (error) {
    console.error('❌ [CRON 8H00] Erreur lors de l\'exécution:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'exécution du Job Hunter automatique',
      error: error.message
    });
  }
};
