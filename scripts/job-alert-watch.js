// scripts/job-alert-watch.js
// Veille emploi Gabon en quasi temps réel : à chaque passage (toutes les 30 min via GitHub Actions),
// récupère les offres de toutes les plateformes, ne garde que les NOUVELLES
// et les envoie sur Telegram et par email.
//
// Variables d'environnement :
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   → alertes Telegram
//   RESEND_API_KEY, NOTIFICATION_EMAIL     → alertes email (RESEND_FROM optionnel)
//   SEEN_JOBS_PATH                         → fichier mémoire des offres déjà vues (défaut : .data/seen-jobs.json)

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

const { harvestGabonJobs } = require('../services/gabon-job-sources');

const SEEN_PATH = path.resolve(rootDir, process.env.SEEN_JOBS_PATH || '.data/seen-jobs.json');
const SEEN_RETENTION_DAYS = 90;
const TELEGRAM_MAX_LENGTH = 3800; // limite Telegram : 4096 caractères par message

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

// ---------- Telegram ----------

function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatJobTelegram(job) {
  const lines = [`💼 <b>${escapeHtml(job.titre)}</b>`];
  lines.push(`🏢 ${escapeHtml(job.entreprise)}`);
  const extra = [job.localisation, job.contrat].filter(Boolean).map(escapeHtml).join(' · ');
  if (extra) lines.push(`📍 ${extra}`);
  lines.push(`🔗 <a href="${escapeHtml(job.lien)}">Voir l'offre</a> (${escapeHtml(job.source)})`);
  return lines.join('\n');
}

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

async function notifyTelegram(jobs) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return { skipped: true };

  const header = `🇬🇦 <b>${jobs.length} nouvelle${jobs.length > 1 ? 's' : ''} offre${jobs.length > 1 ? 's' : ''} d'emploi au Gabon</b>\n\n`;
  const messages = [];
  let current = header;
  for (const job of jobs) {
    const block = formatJobTelegram(job) + '\n\n';
    if (current.length + block.length > TELEGRAM_MAX_LENGTH) {
      messages.push(current);
      current = '';
    }
    current += block;
  }
  if (current.trim()) messages.push(current);

  for (const msg of messages) await sendTelegram(msg);
  return { ok: true, messages: messages.length };
}

// ---------- Email (Resend) ----------

function formatEmailHtml(jobs) {
  const rows = jobs.map(job => `
    <tr><td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
      <div style="font-size:16px;font-weight:600;color:#111827;margin-bottom:4px;">${escapeHtml(job.titre)}</div>
      <div style="font-size:14px;color:#374151;">🏢 ${escapeHtml(job.entreprise)}</div>
      <div style="font-size:13px;color:#6b7280;margin:2px 0 8px;">📍 ${escapeHtml([job.localisation, job.contrat].filter(Boolean).join(' · ') || 'Gabon')} · Source : ${escapeHtml(job.source)}</div>
      <a href="${escapeHtml(job.lien)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;">Voir l'offre</a>
    </td></tr>`).join('');

  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;border-collapse:collapse;overflow:hidden;">
    <tr><td style="background:#111827;color:#ffffff;padding:20px 16px;">
      <div style="font-size:20px;font-weight:700;">🇬🇦 ${jobs.length} nouvelle${jobs.length > 1 ? 's' : ''} offre${jobs.length > 1 ? 's' : ''} d'emploi au Gabon</div>
      <div style="font-size:13px;opacity:.8;margin-top:4px;">Veille automatique · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Libreville' })}</div>
    </td></tr>
    ${rows}
    <tr><td style="padding:14px 16px;font-size:12px;color:#9ca3af;">Sources : emploi.ga, Jobartis Gabon, LinkedIn. Seules les offres jamais envoyées apparaissent ici.</td></tr>
  </table></body></html>`;
}

async function notifyEmail(jobs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) return { skipped: true };

  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const first = jobs[0];
  const subject = jobs.length === 1
    ? `🇬🇦 Nouvelle offre : ${first.titre} (${first.entreprise})`
    : `🇬🇦 ${jobs.length} nouvelles offres d'emploi au Gabon`;

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

  const anySourceOk = Object.values(status).some(s => s.ok);
  if (!anySourceOk) {
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
    const prefix = j.id.split('-')[0];
    if (!knownPrefixes.has(prefix)) {
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

  const results = await Promise.allSettled([notifyTelegram(newJobs), notifyEmail(newJobs)]);
  const [telegram, email] = results.map(r => (r.status === 'fulfilled' ? r.value : { error: r.reason.message }));
  console.log('Telegram :', JSON.stringify(telegram), '| Email :', JSON.stringify(email));

  // On ne mémorise les offres que si au moins un canal les a bien reçues : sinon elles seront renvoyées au prochain passage
  const delivered = [telegram, email].some(r => r.ok);
  const noChannel = [telegram, email].every(r => r.skipped);
  if (delivered || noChannel) {
    newJobs.forEach(j => { seen[j.id] = startedAt; });
    saveSeen(seen);
  } else {
    console.error('Aucun canal n\'a fonctionné : les offres seront renvoyées au prochain passage.');
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('Erreur de la veille emploi :', err);
  process.exitCode = 1;
});
