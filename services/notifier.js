// services/notifier.js
// Service de notification multi-canal (Email via Resend + WhatsApp via CallMeBot / Twilio)
const { Resend } = require('resend');

const DEFAULT_RECIPIENT = {
  nom: "Rosny OTSINA",
  email: "rodrigueotsina@gmail.com",
  phone: "+241 077 12 24 85",
  phoneClean: "241077122485" // Format international sans '+' ni espaces
};

const { getApplicationEmailDetails } = require('./cover-letter-generator');

/**
 * Génère le template HTML pour l'email de rapport d'offres
 */
function generateEmailHtml(profile, analyzedJobs) {
  const topJobs = analyzedJobs.slice(0, 4);
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  let jobCardsHtml = '';
  topJobs.forEach((item, index) => {
    const j = item.job;
    const a = item.analysis;
    const emailDetails = getApplicationEmailDetails(profile, j);
    const scoreColor = a.score >= 90 ? '#27ae60' : (a.score >= 80 ? '#e67e22' : '#2980b9');

    jobCardsHtml += `
      <div style="background:#ffffff; border:1px solid #e1e8ed; border-radius:10px; padding:20px; margin-bottom:18px; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <div>
            <span style="background:${scoreColor}; color:#ffffff; font-weight:bold; font-size:12px; padding:4px 10px; border-radius:15px; display:inline-block; margin-bottom:8px;">
              🎯 Match : ${a.score}%
            </span>
            <h3 style="margin:0 0 5px 0; color:#1a1a1a; font-size:18px;">${index + 1}. ${j.titre}</h3>
            <p style="margin:0; color:#555; font-size:14px;"><strong>🏢 Entreprise :</strong> ${j.entreprise}</p>
          </div>
        </div>
        <div style="background:#f8f9fa; border-radius:6px; padding:10px 14px; margin:12px 0; font-size:13px; color:#444;">
          <p style="margin:3px 0;"><strong>📍 Localisation :</strong> ${j.localisation} | <strong>💼 Contrat :</strong> ${j.type_contrat}</p>
          <p style="margin:3px 0;"><strong>🛠️ Compétences ciblées :</strong> ${j.competences_requises.slice(0, 5).join(', ')}</p>
        </div>
        <div style="margin:10px 0; font-size:13px; color:#2c3e50;">
          <p style="margin:0 0 4px 0;"><strong>✅ Vos atouts clés :</strong></p>
          <ul style="margin:4px 0 10px 20px; padding:0; color:#27ae60;">
            ${a.pointsForts.map(pf => `<li style="margin-bottom:3px;"><span style="color:#333;">${pf}</span></li>`).join('')}
          </ul>
        </div>
        <div style="margin-top:16px; display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <a href="${emailDetails.gmailUrl}" target="_blank" style="background:#27ae60; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:bold; font-size:13.5px; display:inline-block; box-shadow:0 3px 8px rgba(39,174,96,0.3);">
            🚀 Postuler en 1 Clic (Ouvrir Gmail)
          </a>
          <a href="${j.lien}" target="_blank" style="background:#f1f3f5; color:#333; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; font-size:13px; display:inline-block;">
            🔗 Voir l'annonce
          </a>
          <span style="font-size:12px; color:#777; margin-left:6px;">Contact : <code>${j.contact_candidature}</code></span>
        </div>
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Offres d'emploi au Gabon - Rosny OTSINA</title>
    </head>
    <body style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f4f6f8; margin:0; padding:20px; color:#333;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #1f2235, #2d3250); color:#ffffff; padding:28px 24px; text-align:center;">
          <h1 style="margin:0 0 8px 0; font-size:24px; letter-spacing:0.5px;">🇬🇦 Chasse d'Emploi IA — Gabon</h1>
          <p style="margin:0; font-size:14px; opacity:0.9;">Rapport automatique quotidien de 08h00 &bull; ${dateStr}</p>
        </div>

        <!-- Greeting -->
        <div style="padding:24px 24px 10px 24px;">
          <p style="font-size:16px; line-height:1.5; margin:0 0 12px 0;">
            Bonjour <strong>${profile.nom.split(' ')[0]}</strong>,
          </p>
          <p style="font-size:14px; line-height:1.6; color:#555; margin:0 0 20px 0;">
            Tes <strong>4 Agents IA</strong> ont scanné le marché du travail à <strong>Libreville et au Gabon</strong> ce matin. 
            Voici les <strong>${topJobs.length} meilleures opportunités tech</strong> correspondant parfaitement à tes compétences en <strong>Laravel, Flutter, React, Node.js et Python</strong> :
          </p>
          
          <!-- Job Cards -->
          ${jobCardsHtml}

          <!-- Footer Advice -->
          <div style="background:#eef7f2; border-left:4px solid #27ae60; padding:14px 18px; border-radius:4px; margin-top:20px;">
            <h4 style="margin:0 0 6px 0; color:#1e824c;">💡 Conseil IA pour postuler aujourd'hui :</h4>
            <p style="margin:0; font-size:13px; color:#2c3e50; line-height:1.5;">
              N'oublie pas de joindre ton CV actualisé (INPTIC + Master IA) ainsi que les liens de tes projets phares : 
              <strong>Tech Info Plus</strong> (Laravel) et ton <strong>App de Vote</strong> (Flutter).
            </p>
          </div>
        </div>

        <!-- Email Footer -->
        <div style="background:#f8f9fa; border-top:1px solid #e1e8ed; padding:16px 24px; text-align:center; font-size:12px; color:#888;">
          <p style="margin:0 0 4px 0;">Notification générée automatiquement par ton agent IA de chasse d'emploi.</p>
          <p style="margin:0;">Portfolio de Rosny OTSINA &bull; Libreville, Gabon</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Génère le message court et percutant pour WhatsApp
 */
function generateWhatsAppText(profile, analyzedJobs) {
  const topJobs = analyzedJobs.slice(0, 3);
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  let msg = `🤖 *ALERTE EMPLOI GABON (8h00 - ${dateStr})*\n`;
  msg += `Salut *${profile.nom.split(' ')[0]}*, tes agents IA ont trouvé *${topJobs.length} opportunités* au Gabon :\n\n`;

  topJobs.forEach((item, i) => {
    const j = item.job;
    const a = item.analysis;
    const emailDetails = getApplicationEmailDetails(profile, j);
    const medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : '🥉');
    msg += `${medal} *${j.titre}*\n`;
    msg += `🏢 ${j.entreprise} (${j.localisation.split(',')[0]})\n`;
    msg += `🎯 *Match : ${a.score}%* | Contrat : ${j.type_contrat}\n`;
    msg += `🚀 *Postuler en 1 clic (Ouvrir Gmail) :*\n${emailDetails.gmailUrl}\n`;
    msg += `👉 Voir l'offre : ${j.lien}\n\n`;
  });

  msg += `✍️ *Lettres de motivation :* Générées dans \`candidatures/\` (prêtes à imprimer en PDF ou copier).\n`;
  msg += `📁 *Pièces à fournir :* CV INPTIC + lettre ciblée + démo portfolio.\n`;
  msg += `Bonne chance pour tes candidatures ! 🚀`;

  return msg;
}

/**
 * Envoi d'un email via Resend
 */
async function sendEmailNotification({ profile, analyzedJobs, recipientEmail = null }) {
  const to = recipientEmail || process.env.NOTIFICATION_EMAIL || DEFAULT_RECIPIENT.email;
  const apiKey = process.env.RESEND_API_KEY;

  const html = generateEmailHtml(profile, analyzedJobs);
  const subject = `🇬🇦 [Alerte Emploi 8h00] ${analyzedJobs.length} offres tech trouvées à Libreville (Match jusqu'à ${analyzedJobs[0]?.analysis?.score || 98}%)`;

  console.log(`\n📧 [NOTIF EMAIL] Préparation de l'envoi vers ${to}...`);

  if (!apiKey) {
    console.warn(`⚠️ [NOTIF EMAIL] RESEND_API_KEY n'est pas configurée dans les variables d'environnement.`);
    console.log(`ℹ️ Pour activer l'envoi réel par email, ajoute RESEND_API_KEY=re_xxx dans ton fichier .env.local ou sur Vercel.`);
    return {
      success: false,
      skipped: true,
      reason: 'RESEND_API_KEY manquante',
      to,
      subject
    };
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM || 'Alerte Emploi Gabon <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html
    });

    if (error) {
      console.error(`❌ [NOTIF EMAIL] Erreur Resend:`, error);
      return { success: false, error };
    }

    console.log(`✅ [NOTIF EMAIL] Email envoyé avec succès à ${to} (ID: ${data?.id}) !`);
    return { success: true, data };
  } catch (err) {
    console.error(`❌ [NOTIF EMAIL] Exception lors de l'envoi:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Envoi d'un message WhatsApp (CallMeBot gratuit ou Twilio)
 */
async function sendWhatsAppNotification({ profile, analyzedJobs, phone = null }) {
  const targetPhone = phone || process.env.WHATSAPP_PHONE || DEFAULT_RECIPIENT.phoneClean;
  const messageText = generateWhatsAppText(profile, analyzedJobs);

  console.log(`\n📱 [NOTIF WHATSAPP] Préparation du message vers ${targetPhone}...`);

  // Option 1 : CallMeBot (gratuit, idéal pour alertes personnelles WhatsApp)
  // Configuration : envoyer un message "I allow callmebot to send me messages" au +34 941 83 20 12 sur WhatsApp
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY || process.env.WHATSAPP_API_KEY;

  if (callMeBotApiKey) {
    try {
      const encodedMsg = encodeURIComponent(messageText);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodedMsg}&apikey=${callMeBotApiKey}`;

      const res = await fetch(url);
      const body = await res.text();

      if (res.ok && !body.toLowerCase().includes('error')) {
        console.log(`✅ [NOTIF WHATSAPP] Message WhatsApp envoyé avec succès via CallMeBot !`);
        return { success: true, provider: 'callmebot', response: body };
      } else {
        console.warn(`⚠️ [NOTIF WHATSAPP] Réponse CallMeBot: ${body}`);
      }
    } catch (err) {
      console.error(`❌ [NOTIF WHATSAPP] Erreur CallMeBot:`, err.message);
    }
  }

  // Option 2 : Twilio WhatsApp
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

  if (twilioSid && twilioAuth) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');

      const params = new URLSearchParams();
      params.append('From', twilioFrom);
      params.append('To', `whatsapp:+${targetPhone}`);
      params.append('Body', messageText);

      const twilioRes = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const twilioData = await twilioRes.json();
      if (twilioRes.ok) {
        console.log(`✅ [NOTIF WHATSAPP] Message WhatsApp envoyé avec succès via Twilio (SID: ${twilioData.sid}) !`);
        return { success: true, provider: 'twilio', sid: twilioData.sid };
      } else {
        console.error(`❌ [NOTIF WHATSAPP] Erreur Twilio:`, twilioData);
      }
    } catch (err) {
      console.error(`❌ [NOTIF WHATSAPP] Erreur d'envoi Twilio:`, err.message);
    }
  }

  // Fallback si aucune clé d'API WhatsApp n'est encore enregistrée :
  // On génère le lien direct WhatsApp cliquable avec le texte pré-rempli !
  const directWaLink = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;
  console.log(`ℹ️ [NOTIF WHATSAPP] Aucune clé API WhatsApp (CallMeBot / Twilio) n'est encore renseignée.`);
  console.log(`🔗 Lien direct WhatsApp généré avec le message pré-rempli :`);
  console.log(`   ${directWaLink.substring(0, 85)}...`);
  console.log(`\n💬 Aperçu du message WhatsApp prêt :`);
  console.log(`-----------------------------------------------------------------`);
  console.log(messageText);
  console.log(`-----------------------------------------------------------------`);

  return {
    success: false,
    skipped: true,
    reason: 'CALLMEBOT_API_KEY ou TWILIO non configuré',
    directLink: directWaLink,
    messagePreview: messageText
  };
}

/**
 * Dispatch complet des notifications (Email + WhatsApp)
 */
async function dispatchDailyJobAlerts(profile, analyzedJobs) {
  console.log("\n===============================================================");
  console.log("🚀 ENVOI DES NOTIFICATIONS QUOTIDIENNES (EMAIL + WHATSAPP)");
  console.log("===============================================================");

  const emailResult = await sendEmailNotification({ profile, analyzedJobs });
  const whatsappResult = await sendWhatsAppNotification({ profile, analyzedJobs });

  return {
    email: emailResult,
    whatsapp: whatsappResult,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  DEFAULT_RECIPIENT,
  generateEmailHtml,
  generateWhatsAppText,
  sendEmailNotification,
  sendWhatsAppNotification,
  dispatchDailyJobAlerts
};
