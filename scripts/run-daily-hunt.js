// scripts/run-daily-hunt.js
// Script d'exécution quotidienne (lancé manuellement, par cron ou par le planificateur Windows)

const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement depuis .env ou .env.local
const rootDir = path.resolve(__dirname, '..');
const envLocal = path.join(rootDir, '.env.local');
const envFile = path.join(rootDir, '.env');

if (fs.existsSync(envLocal)) {
  try {
    process.loadEnvFile(envLocal);
    console.log('✅ Variables d\'environnement chargées depuis .env.local');
  } catch (e) {
    // Si format spécial, ignorer
  }
} else if (fs.existsSync(envFile)) {
  try {
    process.loadEnvFile(envFile);
    console.log('✅ Variables d\'environnement chargées depuis .env');
  } catch (e) {
    //
  }
}

const { runJobHunterAgent } = require('./job-hunter-gabon');
const { dispatchDailyJobAlerts } = require('../services/notifier');

async function main() {
  console.log(`\n===============================================================`);
  console.log(`⏰ CHASSE D'EMPLOI GABON — EXÉCUTION QUOTIDIENNE (8H00)`);
  console.log(`Date : ${new Date().toLocaleString('fr-FR')}`);
  console.log(`===============================================================\n`);

  // 1. Exécuter le système multi-agents
  const result = await runJobHunterAgent();

  // 2. Envoyer les notifications Email + WhatsApp
  await dispatchDailyJobAlerts(result.profile, result.analyzedJobs);

  console.log(`\n🎉 Exécution terminée avec succès !`);
}

main().catch(err => {
  console.error('❌ Erreur lors de l\'exécution quotidienne:', err);
  process.exit(1);
});
