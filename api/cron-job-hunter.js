// api/cron-job-hunter.js
// Endpoint Serverless & Cron Job Vercel pour la recherche quotidienne d'emploi au Gabon
// Exécuté automatiquement chaque matin à 8h00 (07h00 UTC) ou déclenchable manuellement

const { runJobHunterAgent } = require('../scripts/job-hunter-gabon');
const { dispatchDailyJobAlerts } = require('../services/notifier');

module.exports = async (req, res) => {
  // Authentification obligatoire : Vercel Cron envoie automatiquement
  // "Authorization: Bearer <CRON_SECRET>" quand la variable CRON_SECRET est définie.
  // Pour un déclenchement manuel : curl -H "Authorization: Bearer <CRON_SECRET>" .../api/cron-job-hunter
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('❌ CRON_SECRET non configurée : exécution refusée');
    return res.status(500).json({ success: false, message: 'CRON_SECRET manquante sur le serveur.' });
  }
  if (req.headers['authorization'] !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
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
