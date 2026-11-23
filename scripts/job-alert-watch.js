// scripts/job-alert-watch.js
// Veille emploi Gabon en quasi temps réel : à chaque passage (toutes les 30 min via GitHub Actions),
// récupère les offres de toutes les plateformes, ne garde que les NOUVELLES,
// lit leur détail, les analyse (pertinence pour ton profil + résumé)
// puis les envoie sur Telegram et par email.
//
// Variables d'environnement :
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   → alertes Telegram
//   RESEND_API_KEY, NOTIFICATION_EMAIL     → alertes email (RESEND_FROM optionnel)
//   OPENROUTER_API_KEY                     → analyse IA (optionnel : sinon tri par mots-clés)
//   OPENROUTER_MODEL                       → modèle IA (défaut : deepseek/deepseek-chat)
//   TELEGRAM_NIVEAU_MIN                    → "faible" (défaut, tout reçu) | "moyenne" | "forte"
//   SEEN_JOBS_PATH                         → mémoire des offres déjà vues (défaut : .data/seen-jobs.json)

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
for (const envFile of ['.env.local', '.env']) {
  const p = path.join(rootDir, envFile);
  if (fs.existsSync(p)) {
    try { process.loadEnvFile(p); } catch (e) { /* format non standard : ignoré */ }
    break;
  }
}

const { harvestGabonJobs, addJobDetails } = require('../services/gabon-job-sources');
const { analyzeJobs, LEVELS } = require('../services/job-ai-analyzer');

const SEEN_PATH = path.resolve(rootDir, process.env.SEEN_JOBS_PATH || '.data/seen-jobs.json');
const SEEN_RETENTION_DAYS = 90;
const TELEGRAM_MAX_LENGTH = 3800; // limite Telegram : 4096 caractères par message
const MAX_DETAILED_PER_RUN = 25;

const LEVEL_LABEL = {
  forte: { emoji: '🟢', texte: 'Très pertinent pour toi', couleur: '#16a34a' },
  moyenne: { emoji: '🟡', texte: 'À regarder', couleur: '#ca8a04' },
  faible: { emoji: '⚪', texte: 'Hors profil', couleur: '#9ca3af' }
};

// ---------- Mémoire des offres déjà vues ----------

function loadSeen() {
  try {
    return JSON.parse(fs.readFileSync(SEEN_PATH, 'utf8'));
  } catch (e) {
    return null; // première exécution
  }
}

function saveSeen(seen) {
  const cutoff = Date.now() - SEEN_RETENTION_DAYS * 24 * 3600 * 1000;
  for (const [id, firstSeen] of Object.entries(seen)) {
    if (Date.parse(firstSeen) < cutoff) delete seen[id];
  }
  fs.mkdirSync(path.dirname(SEEN_PATH), { recursive: true });
  fs.writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 1), 'utf8');
}

// ---------- Mise en forme ----------

function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function lieuContrat(job) {
  return [job.localisation, job.contrat].filter(Boolean).join(' · ');
}

function formatJobTelegramDetailed(job) {
  const a = job.analyse;
  const lvl = LEVEL_LABEL[a.pertinence];
  const lines = [`${lvl.emoji} <b>${escapeHtml(job.titre)}</b>`, `🏢 ${escapeHtml(job.entreprise)}`];
  if (lieuContrat(job)) lines.push(`📍 ${escapeHtml(lieuContrat(job))}`);
  if (a.raison) lines.push(`💡 <i>${escapeHtml(a.raison)}</i>`);
  if (a.missions) lines.push(`📋 <b>Missions :</b> ${escapeHtml(a.missions)}`);
  if (a.profil) lines.push(`🎓 <b>Profil :</b> ${escapeHtml(a.profil)}`);
  if (a.dateLimite) lines.push(`⏰ <b>Date limite :</b> ${escapeHtml(a.dateLimite)}`);
  if (a.candidature) lines.push(`✉️ <b>Postuler :</b> ${escapeHtml(a.candidature)}`);
  lines.push(`🔗 <a href="${escapeHtml(job.lien)}">Voir l'offre complète</a> (${escapeHtml(job.source)})`);
  return lines.join('\n');
}

function formatJobTelegramShort(job) {
  return `⚪ <a href="${escapeHtml(job.lien)}">${escapeHtml(job.titre)}</a> — ${escapeHtml(job.entreprise)}`;
}

function formatEmailJob(job) {
  const a = job.analyse;
  const lvl = LEVEL_LABEL[a.pertinence];
  const row = (label, value) => value
    ? `<div style="font-size:13px;color:#374151;margin:3px 0;"><b>${label}</b> ${escapeHtml(value)}</div>` : '';
  return `
    <tr><td style="padding:16px;border-bottom:1px solid #e5e7eb;">
      <span style="display:inline-block;font-size:11px;font-weight:700;color:#ffffff;background:${lvl.couleur};padding:2px 8px;border-radius:10px;margin-bottom:6px;">${lvl.emoji} ${lvl.texte}</span>
      <div style="font-size:16px;font-weight:600;color:#111827;margin-bottom:2px;">${escapeHtml(job.titre)}</div>
      <div style="font-size:14px;color:#374151;">🏢 ${escapeHtml(job.entreprise)}</div>
      <div style="font-size:13px;color:#6b7280;margin:2px 0 8px;">📍 ${escapeHtml(lieuContrat(job) || 'Gabon')} · Source : ${escapeHtml(job.source)}</div>
      ${a.raison ? `<div style="font-size:13px;color:#4b5563;font-style:italic;margin-bottom:6px;">💡 ${escapeHtml(a.raison)}</div>` : ''}
      ${row('📋 Missions :', a.missions)}
      ${row('🎓 Profil :', a.profil)}
      ${row('⏰ Date limite :', a.dateLimite)}
      ${row('✉️ Postuler :', a.candidature)}
      <a href="${escapeHtml(job.lien)}" style="display:inline-block;margin-top:8px;background:#111827;color:#ffffff;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;">Voir l'offre complète</a>
    </td></tr>`;
}

function countLabel(n) {
  return `${n} nouvelle${n > 1 ? 's' : ''} offre${n > 1 ? 's' : ''} d'emploi au Gabon`;
}

function summaryByLevel(jobs) {
  return LEVELS
    .map(l => [l, jobs.filter(j => j.analyse.pertinence === l).length])
    .filter(([, n]) => n > 0)
    .map(([l, n]) => `${LEVEL_LABEL[l].emoji} ${n}`)
    .join('  ');
}

// ---------- Telegram ----------

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { skipped: true };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  const data = await res.json();
  if (!data.ok) throw new Error('Telegram : ' + data.description);
  return { ok: true };
}

function packMessages(blocks, header) {
  const messages = [];
  let current = header;
  for (const block of blocks) {
    if (current.length + block.length + 2 > TELEGRAM_MAX_LENGTH && current.trim()) {
      messages.push(current);
      current = '';
    }
    current += block + '\n\n';
  }
  if (current.trim()) messages.push(current);
  return messages;
}

async function notifyTelegram(jobs) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return { skipped: true };

  const minLevel = LEVELS.includes(process.env.TELEGRAM_NIVEAU_MIN) ? process.env.TELEGRAM_NIVEAU_MIN : 'faible';
  const maxIndex = LEVELS.indexOf(minLevel);
  const detailed = jobs.filter(j => j.analyse.pertinence !== 'faible' && LEVELS.indexOf(j.analyse.pertinence) <= maxIndex);
  const others = minLevel === 'faible' ? jobs.filter(j => j.analyse.pertinence === 'faible') : [];
  if (detailed.length === 0 && others.length === 0) return { skipped: true, reason: 'aucune offre au niveau demandé' };

  const header = `🇬🇦 <b>${countLabel(jobs.length)}</b>\n${summaryByLevel(jobs)}\n\n`;
  const blocks = detailed.map(formatJobTelegramDetailed);
  if (others.length) blocks.push(`<b>Autres offres (hors profil) :</b>\n` + others.map(formatJobTelegramShort).join('\n'));

  const messages = packMessages(blocks, header);
  for (const msg of messages) await sendTelegram(msg);
  return { ok: true, messages: messages.length };
}

// ---------- Email (Resend) ----------

function formatEmailHtml(jobs) {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;border-collapse:collapse;overflow:hidden;">
    <tr><td style="background:#111827;color:#ffffff;padding:20px 16px;">
      <div style="font-size:20px;font-weight:700;">🇬🇦 ${countLabel(jobs.length)}</div>
      <div style="font-size:13px;opacity:.85;margin-top:4px;">${summaryByLevel(jobs)} · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Libreville' })}</div>
    </td></tr>
    ${jobs.map(formatEmailJob).join('')}
    <tr><td style="padding:14px 16px;font-size:12px;color:#9ca3af;">Sources : emploi.ga et LinkedIn. Résumés et pertinence générés automatiquement à partir du texte des offres : vérifie toujours l'annonce complète avant de postuler.</td></tr>
  </table></body></html>`;
}

async function notifyEmail(jobs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) return { skipped: true };

  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const strong = jobs.filter(j => j.analyse.pertinence === 'forte').length;
  const first = jobs[0];
  const subject = jobs.length === 1
    ? `${LEVEL_LABEL[first.analyse.pertinence].emoji} Nouvelle offre : ${first.titre} (${first.entreprise})`
    : `🇬🇦 ${countLabel(jobs.length)}${strong ? ` dont ${strong} très pertinente${strong > 1 ? 's' : ''}` : ''}`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'Veille Emploi Gabon <onboarding@resend.dev>',
    to: [to],
    subject,
    html: formatEmailHtml(jobs)
  });
  if (error) throw new Error('Resend : ' + (error.message || JSON.stringify(error)));
  return { ok: true };
}

// ---------- Programme principal ----------

async function main() {
  const startedAt = new Date().toISOString();
  const { jobs, status } = await harvestGabonJobs();
  console.log(`[${startedAt}] Sources :`, JSON.stringify(status));

  if (!Object.values(status).some(s => s.ok)) {
    console.error('Aucune plateforme n\'a répondu : rien n\'est envoyé ni enregistré.');
    process.exitCode = 1;
    return;
  }

  const seen = loadSeen();

  // Première exécution : on mémorise l'existant sans l'envoyer (sinon des dizaines d'anciennes offres arriveraient d'un coup)
  if (seen === null) {
    const initial = {};
    jobs.forEach(j => { initial[j.id] = startedAt; });
    saveSeen(initial);
    console.log(`Première exécution : ${jobs.length} offres existantes mémorisées, aucune alerte envoyée.`);
    await sendTelegram(
      `✅ <b>Veille emploi Gabon activée</b>\n${jobs.length} offres déjà en ligne ont été mémorisées.\n` +
      `Tu recevras ici chaque nouvelle offre dès qu'elle est publiée (vérification toutes les 30 min).`
    ).catch(e => console.warn(e.message));
    return;
  }

  // Une plateforme qui répond pour la première fois (ex : LinkedIn bloqué lors du premier passage)
  // est mémorisée sans alerte, pour ne pas envoyer d'un coup toutes ses anciennes offres.
  const knownPrefixes = new Set(Object.keys(seen).map(id => id.split('-')[0]));
  const firstTimeSources = new Set();
  jobs.forEach(j => {
    if (!knownPrefixes.has(j.id.split('-')[0])) {
      firstTimeSources.add(j.source);
      seen[j.id] = startedAt;
    }
  });
  if (firstTimeSources.size > 0) {
    console.log(`Nouvelle(s) source(s) mémorisée(s) sans alerte : ${[...firstTimeSources].join(', ')}`);
    saveSeen(seen);
  }

  const newJobs = jobs.filter(j => !seen[j.id]);
  console.log(`${jobs.length} offres trouvées, ${newJobs.length} nouvelle(s).`);
  if (newJobs.length === 0) return;

  // Détails (missions, profil, date limite) et retrait des offres fermées ou expirées
  const detailedJobs = await addJobDetails(newJobs, MAX_DETAILED_PER_RUN);
  const closed = detailedJobs.filter(j => j.fermee);
  const openJobs = detailedJobs.filter(j => !j.fermee);
  if (closed.length) console.log(`${closed.length} offre(s) fermée(s) ignorée(s).`);

  // Analyse : pertinence pour ton profil + résumé
  const analyzed = await analyzeJobs(openJobs);
  analyzed.forEach(j => console.log(`  ${LEVEL_LABEL[j.analyse.pertinence].emoji} ${j.titre} — ${j.entreprise}${j.analyse.parIA ? ' (IA)' : ''}`));

  let telegram = { skipped: true };
  let email = { skipped: true };
  if (analyzed.length > 0) {
    const results = await Promise.allSettled([notifyTelegram(analyzed), notifyEmail(analyzed)]);
    [telegram, email] = results.map(r => (r.status === 'fulfilled' ? r.value : { error: r.reason.message }));
  }
  console.log('Telegram :', JSON.stringify(telegram), '| Email :', JSON.stringify(email));

  // On ne mémorise les offres que si au moins un canal les a bien reçues : sinon elles seront renvoyées au prochain passage
  const delivered = [telegram, email].some(r => r.ok);
  const noError = [telegram, email].every(r => !r.error);
  if (delivered || noError) {
    newJobs.forEach(j => { seen[j.id] = startedAt; });
    saveSeen(seen);
  } else {
    console.error('Aucun canal n\'a fonctionné : les offres seront renvoyées au prochain passage.');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Erreur de la veille emploi :', err);
    process.exitCode = 1;
  });
}

module.exports = { formatJobTelegramDetailed, formatJobTelegramShort, formatEmailHtml, packMessages };
