// api/chatbot.js - API backend pour le chatbot avec Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le message ne peut pas être vide' 
      });
    }

    // Vérifier que la clé API est configurée
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_API_KEY n\'est pas configurée');
      return res.status(500).json({ 
        success: false, 
        message: 'Configuration API manquante. Veuillez contacter l\'administrateur.' 
      });
    }

    // Initialiser Google Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // Utiliser gemini-1.5-flash (plus récent et plus rapide) ou gemini-pro en fallback
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (e) {
      // Fallback vers gemini-pro si gemini-1.5-flash n'est pas disponible
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    // Construire le contexte pour l'IA
    const systemPrompt = `Tu es l'assistant IA de Rosny OTSINA, un développeur web et mobile freelance basé à Libreville, Gabon.

INFORMATIONS SUR ROSNY:
- Compétences Frontend: HTML (Avancé), CSS (Intermédiaire), JavaScript/TypeScript, Vue.js/React.js/Bootstrap
- Compétences Backend: PHP/Laravel, Node.js/Express.js/NestJS, Python (Django/FastAPI), Java
- Compétences Mobile: Flutter, Java/Kotlin (Android)
- Bases de données: MySQL/PostgreSQL/SQLite, MongoDB
- Autres: Sécurité informatique, Maintenance, Déploiement

PROJETS RÉALISÉS:
1. Application de traduction des langues gabonaises - Application innovante pour préserver et traduire les langues locales
2. Système de facturation TECH INFO PLUS - Application web de facturation et suivi de stock pour PME
3. Application de gestion des notes - Application multiplateforme pour suivre les notes étudiants
4. Shopping App & Food App - Applications mobiles e-commerce avec panier et notifications
5. Site immobilier - Plateforme complète avec inscription, connexion et gestion d'annonces
6. Permis Virtuel - Application web pour permis de conduire dématérialisés

SERVICES:
- Développement Web (sites, applications, API)
- Développement Mobile (Android/iOS avec Flutter)
- Conception de bases de données
- Sécurité informatique
- Maintenance et support technique
- Déploiement et hébergement

CONTACT:
- Email: rodrigueotsina@gmail.com
- Téléphone: +241 077 12 24 85
- Localisation: Libreville, Gabon
- GitHub: https://github.com/RosnyMinko07
- Statut: Disponible immédiatement en freelance

FORMATION:
- Licence professionnelle en Informatique - INPTIC
- Master Intelligence Artificielle (en cours)
- Spécialisation: Génie Logiciel

TON RÔLE:
- Répondre de manière amicale et professionnelle
- Fournir des informations précises sur Rosny, ses compétences, projets et services
- Encourager les visiteurs à contacter Rosny pour des projets
- Répondre en français de manière naturelle et conversationnelle
- Utiliser des emojis avec modération pour rendre les réponses plus engageantes
- Si tu ne connais pas quelque chose, redirige vers les informations que tu connais ou suggère de contacter directement Rosny

Réponds de manière concise mais informative.`;

    // Construire l'historique de conversation
    let conversationContext = systemPrompt + '\n\n';
    
    // Ajouter l'historique récent (derniers 5 échanges pour garder le contexte)
    const recentHistory = conversationHistory.slice(-5);
    if (recentHistory.length > 0) {
      conversationContext += 'HISTORIQUE DE LA CONVERSATION:\n';
      recentHistory.forEach(({ role, content }) => {
        conversationContext += `${role === 'user' ? 'Visiteur' : 'Assistant'}: ${content}\n`;
      });
      conversationContext += '\n';
    }

    conversationContext += `Visiteur: ${message}\nAssistant:`;

    // Générer la réponse avec Gemini
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const aiResponse = response.text();

    return res.status(200).json({ 
      success: true, 
      message: aiResponse.trim()
    });
    
  } catch (error) {
    console.error('Erreur Gemini API:', error);
    console.error('Détails de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Gérer les erreurs spécifiques
    if (error.message && (error.message.includes('API_KEY') || error.message.includes('API key'))) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur de configuration API. Veuillez contacter l\'administrateur.' 
      });
    }
    
    if (error.message && (error.message.includes('quota') || error.message.includes('QUOTA'))) {
      return res.status(429).json({ 
        success: false, 
        message: 'Limite de requêtes atteinte. Veuillez réessayer plus tard.' 
      });
    }
    
    if (error.message && error.message.includes('MODEL_NOT_FOUND')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Modèle IA non disponible. Veuillez contacter l\'administrateur.' 
      });
    }
    
    // Retourner le message d'erreur pour le débogage (en production, vous pouvez le masquer)
    return res.status(500).json({ 
      success: false, 
      message: 'Désolé, une erreur est survenue. Veuillez réessayer.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
