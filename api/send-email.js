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
    const { name, email, subject, message } = req.body;
    
    // Utilisez Resend si vous avez une clé API
    // OU utilisez nodemailer avec un service gratuit
    
    // Option 1: Avec Resend (nécessite clé API)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const { data, error } = await resend.emails.send({
    //   from: 'Portfolio <onboarding@resend.dev>',
    //   to: 'rodrigueotsina@gmail.com',
    //   subject: `Nouveau message: ${subject}`,
    //   html: `<p><strong>Nom:</strong> ${name}</p>
    //          <p><strong>Email:</strong> ${email}</p>
    //          <p><strong>Message:</strong> ${message}</p>`
    // });
    
    // Option 2: Simulation réussie (pour test)
    console.log('Message reçu:', { name, email, subject, message });
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès! Je vous répondrai bientôt.' 
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
    });
  }
};