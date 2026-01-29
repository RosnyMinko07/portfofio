// api/chatbot.js - API backend pour le chatbot avec DeepSeek via OpenRouter

module.exports = async (req, res) => {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
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

    // Vérifier la clé API OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('Vérification de la clé OpenRouter API...', apiKey ? 'Clé présente' : 'Clé manquante');
    
    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY n\'est pas configurée');
      return res.status(500).json({ 
        success: false, 
        message: 'Configuration API manquante. La clé OPENROUTER_API_KEY n\'est pas configurée sur Vercel.' 
      });
    }

    // Informations sur Rosny pour le contexte
    const rosnyInfo = `
ROSNY OTSINA - Développeur Web & Mobile Freelance

COMPÉTENCES TECHNIQUES:
• Frontend: HTML (Avancé), CSS (Intermédiaire), JavaScript/TypeScript, Vue.js/React.js/Bootstrap
• Backend: PHP/Laravel, Node.js/Express.js/NestJS, Python (Django/FastAPI), Java
• Mobile: Flutter, Java/Kotlin (Android)
• Bases de données: MySQL/PostgreSQL/SQLite, MongoDB
• Autres: Sécurité informatique, Maintenance, Déploiement

PROJETS RÉALISÉS:
1. Application de traduction des langues gabonaises - Application innovante pour préserver et traduire les langues locales
2. Système de facturation TECH INFO PLUS - Application web de facturation et suivi de stock pour PME
3. Application de gestion des notes - Application multiplateforme pour suivre les notes étudiants
4. Shopping App & Food App - Applications mobiles e-commerce avec panier et notifications
5. Site immobilier - Plateforme complète avec inscription, connexion et gestion d'annonces
6. Permis Virtuel - Application web pour permis de conduire dématérialisés

SERVICES PROPOSÉS:
- Développement Web (sites vitrines, applications web, API REST)
- Développement Mobile (Android/iOS avec Flutter)
- Conception et optimisation de bases de données
- Audit et renforcement de la sécurité informatique
- Maintenance et support technique
- Déploiement et hébergement sur serveurs

INFORMATIONS DE CONTACT:
• Email: rodrigueotsina@gmail.com
• Téléphone: +241 077 12 24 85
• Localisation: Libreville, Gabon
• GitHub: https://github.com/RosnyMinko07
• Statut: Disponible immédiatement pour des missions freelance

FORMATION:
• Licence professionnelle en Informatique - INPTIC
• Master Intelligence Artificielle (en cours)
• Spécialisation: Génie Logiciel

TON RÔLE EN TANT QU'ASSISTANT IA:
- Tu es l'assistant IA personnel de Rosny OTSINA
- Réponds toujours en français de manière professionnelle et amicale
- Utilise les informations ci-dessus pour répondre aux questions
- Encourage les visiteurs à contacter Rosny pour des projets
- Sois précis sur ses compétences techniques et ses projets
- Si tu ne sais pas quelque chose, redirige vers les informations disponibles
- Utilise un ton conversationnel naturel, avec quelques emojis appropriés
`;

    // Construire le système de messages pour OpenRouter
    const messages = [
      {
        role: "system",
        content: rosnyInfo + "\n\nInstructions importantes: Réponds uniquement en français. Sois concis mais informatif. Ne mentionne pas que tu es une IA, agis comme l'assistant personnel de Rosny."
      }
    ];

    // Ajouter l'historique de conversation
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Envoi de la requête à OpenRouter (DeepSeek R1 0528)...');

    // Appeler l'API OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://rosny-portfolio.vercel.app',
        'X-Title': 'Portfolio Rosny OTSINA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenRouter:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`Erreur OpenRouter (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse invalide de l\'API OpenRouter');
    }

    const aiResponse = data.choices[0].message.content.trim();
    
    console.log('✅ Réponse reçue avec succès de DeepSeek R1 0528');

    return res.status(200).json({ 
      success: true, 
      message: aiResponse
    });
    
  } catch (error) {
    console.error('Erreur dans l\'API chatbot:', error);
    console.error('Détails:', error.message);
    
    let errorMessage = 'Erreur lors de la génération de la réponse.';
    
    if (error.message.includes('OPENROUTER_API_KEY') || error.message.includes('API key')) {
      errorMessage = 'Configuration API manquante. Veuillez configurer la clé OpenRouter.';
    } else if (error.message.includes('429') || error.message.includes('quota')) {
      errorMessage = 'Limite de requêtes atteinte. Veuillez réessayer plus tard.';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      errorMessage = 'Clé API invalide. Veuillez vérifier la configuration.';
    }
    
    return res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message
    });
  }
};