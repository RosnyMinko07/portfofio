// scripts/scheduler-daemon.js
// Démon en arrière-plan qui planifie l'exécution chaque jour à 08h00 pile

const { spawn } = require('child_process');
const path = require('path');

function getNext8AM() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(8, 0, 0, 0);

  // Si 8h00 est déjà passé aujourd'hui, programmer pour demain à 8h00
  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

function runHunterScript() {
  console.log(`\n⏰ [${new Date().toLocaleTimeString('fr-FR')}] 08h00 sonne ! Lancement du Job Hunter...`);
  const scriptPath = path.join(__dirname, 'run-daily-hunt.js');
  
  const child = spawn(process.execPath, [scriptPath], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  child.on('close', code => {
    console.log(`✅ Job Hunter terminé avec le code ${code}.`);
    scheduleNextRun();
  });
}

function scheduleNextRun() {
  const nextRun = getNext8AM();
  const delayMs = nextRun.getTime() - Date.now();
  const hoursRemaining = (delayMs / (1000 * 60 * 60)).toFixed(1);

  console.log(`📅 Prochaine exécution programmée pour : ${nextRun.toLocaleString('fr-FR')} (dans ~${hoursRemaining}h)`);

  setTimeout(runHunterScript, delayMs);
}

console.log("===============================================================");
console.log("🤖 DÉMON CHASSE D'EMPLOI GABON — PLANIFICATEUR 8H00");
console.log("===============================================================");
console.log("Ce script tourne en arrière-plan et déclenche la recherche");
console.log("d'emploi ainsi que l'envoi Email + WhatsApp chaque jour à 08h00.");
console.log("---------------------------------------------------------------");

scheduleNextRun();
