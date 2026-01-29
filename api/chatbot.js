// api/chatbot.js - API backend pour le chatbot avec Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Fonction pour appeler l'API Gemini directement via REST (v1beta)
async function callGeminiAPI(apiKey, prompt) {
  const https = require('https');
  const url = require('url');
  
  return new Promise((resolve, reject) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const parsedUrl = url.parse(apiUrl);
    
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`Erreur API Gemini (${res.statusCode}): ${data}`));
            return;
          }
          
          const response = JSON.parse(data);
          
          // Vérifier les erreurs dans la réponse
          if (response.error) {
            reject(new Error(`Erreur Gemini API: ${response.error.message || JSON.stringify(response.error)}`));
            return;
          }
          
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            const text = response.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error('Réponse invalide de l\'API Gemini: ' + JSON.stringify(response)));
          }
        } catch (e) {
          reject(new Error('Erreur lors du parsing de la réponse: ' + e.message + ' | Data: ' + data.substring(0, 200)));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(new Error('Erreur de requête: ' + e.message));
    });
    
    req.write(postData);
    req.end();
  });
}

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
    console.log('Vérification de la clé API...', apiKey ? 'Clé présente' : 'Clé manquante');
    if (!apiKey) {
      console.error('❌ GOOGLE_GEMINI_API_KEY n\'est pas configurée');
      return res.status(500).json({ 
        success: false, 
        message: 'Configuration API manquante. La clé GOOGLE_GEMINI_API_KEY n\'est pas configurée sur Vercel.' 
      });
    }

    // Initialiser Google Gemini avec l'API v1beta pour les modèles récents
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Essayer d'abord avec gemini-1.5-flash (modèle rapide et récent)
    // Si ça ne fonctionne pas, essayer gemini-pro
    let model;
    let modelName = 'gemini-1.5-flash';
    
    try {
      // Essayer gemini-1.5-flash d'abord (nécessite parfois v1beta)
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('✅ Utilisation du modèle: gemini-1.5-flash');
    } catch (e1) {
      console.log('⚠️ gemini-1.5-flash non disponible, essai avec gemini-pro...');
      try {
        // Fallback vers gemini-pro
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        modelName = 'gemini-pro';
        console.log('✅ Utilisation du modèle: gemini-pro');
      } catch (e2) {
        console.log('⚠️ gemini-pro non disponible, essai avec gemini-1.0-pro...');
        try {
          // Dernier essai avec gemini-1.0-pro
          model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
          modelName = 'gemini-1.0-pro';
          console.log('✅ Utilisation du modèle: gemini-1.0-pro');
        } catch (e3) {
          throw new Error(`Aucun modèle Gemini disponible. Erreurs: ${e1.message}, ${e2.message}, ${e3.message}. Vérifiez votre clé API.`);
        }
      }
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
    console.log(`Envoi de la requête à Gemini avec le modèle ${modelName}...`);
    
    let aiResponse;
    try {
      const result = await model.generateContent(conversationContext);
      const response = await result.response;
      aiResponse = response.text();
      console.log('✅ Réponse reçue de Gemini avec succès');
    } catch (modelError) {
      // Si l'erreur indique que le modèle n'est pas disponible, essayer avec l'API REST v1beta
      if (modelError.message && modelError.message.includes('404') && modelError.message.includes('not found')) {
        console.log('⚠️ Modèle non disponible avec SDK, utilisation de l\'API REST v1beta...');
        aiResponse = await callGeminiAPI(apiKey, conversationContext);
      } else {
        throw modelError;
      }
    }

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
    
    // Retourner le message d'erreur pour le débogage
    const errorMessage = error.message || 'Erreur inconnue';
    console.error('Message d\'erreur complet:', errorMessage);
    
    return res.status(500).json({ 
      success: false, 
      message: `Erreur serveur: ${errorMessage}`,
      error: errorMessage,
      type: error.name || 'UnknownError'
    });
  }
};
