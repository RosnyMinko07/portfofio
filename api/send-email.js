// api/send-email.js
const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Autoriser les requêtes cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (nom, email, objet, message) sont obligatoires.'
      });
    }

    // Validation basique de l'adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Adresse email invalide.'
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY non configurée');
      return res.status(500).json({
        success: false,
        message: "Service d'envoi temporairement indisponible (clé RESEND_API_KEY manquante sur le serveur)."
      });
    }

    const resend = new Resend(apiKey);

    // Échapper le HTML pour la sécurité
    const escapeHtml = (str) => {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="background-color: #304cfd; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Nouveau message depuis ton Portfolio</h2>
        </div>
        
        <div style="padding: 20px 10px;">
          <p style="margin: 8px 0; font-size: 15px;"><strong>Expéditeur :</strong> ${safeName}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Email :</strong> <a href="mailto:${safeEmail}" style="color: #304cfd;">${safeEmail}</a></p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Objet :</strong> ${safeSubject}</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <div style="background-color: #f7f8fc; padding: 15px; border-left: 4px solid #304cfd; border-radius: 4px;">
            <p style="margin: 0; color: #333; line-height: 1.6; font-size: 14px;">${safeMessage}</p>
          </div>
          
          <div style="margin-top: 25px; text-align: center;">
            <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #304cfd; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Répondre à ${safeName}
            </a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; font-size: 12px; color: #888; text-align: center;">
          Message envoyé depuis le formulaire de contact de ton portfolio.
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: 'rodrigueotsina@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject} - ${name}`,
      html: htmlContent
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message via Resend. Veuillez me contacter directement à rodrigueotsina@gmail.com.'
      });
    }

    console.log('✅ Email envoyé avec succès:', data);

    // Notification WhatsApp instantanée via CallMeBot (si configuré)
    const callMeBotApiKey = process.env.CALLMEBOT_API_KEY || process.env.WHATSAPP_API_KEY;
    const targetPhone = process.env.WHATSAPP_PHONE || '241077122485';
    if (callMeBotApiKey) {
      try {
        const waMsg = `📬 *Nouveau message reçu depuis ton Portfolio !*\n\n👤 *Expéditeur :* ${name}\n📧 *Email :* ${email}\n📌 *Objet :* ${subject}\n\n💬 *Message :*\n${message}`;
        fetch(`https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodeURIComponent(waMsg)}&apikey=${callMeBotApiKey}`)
          .catch(e => console.warn('⚠️ Notification WhatsApp (CallMeBot):', e.message));
      } catch (waErr) {
        console.warn('⚠️ Notification WhatsApp (CallMeBot) exception:', waErr.message);
      }
    }
    
    // Notification Telegram instantanée (si configuré)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      try {
        const tgText = `📬 *Nouveau message reçu sur ton Portfolio !*\n\n👤 *De :* ${name} (${email})\n📌 *Objet :* ${subject}\n\n💬 *Message :*\n${message}`;
        fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: tgText, parse_mode: 'Markdown' })
        }).catch(err => console.warn('⚠️ Telegram notif error:', err.message));
      } catch (tgErr) {
        console.warn('⚠️ Telegram exception:', tgErr.message);
      }
    }

    // Notification Push Mobile NTFY (si configuré)
    const ntfyTopic = process.env.NTFY_TOPIC;
    if (ntfyTopic) {
      try {
        fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: {
            'Title': encodeURIComponent(`Nouveau message : ${name}`),
            'Priority': 'high',
            'Tags': 'email,envelope'
          },
          body: `${subject} : ${message}`
        }).catch(() => {});
      } catch (nErr) {}
    }

    return res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès ! Je vous répondrai très rapidement.'
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi du message.'
    });
  }
};