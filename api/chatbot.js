// api/chatbot.js - Chatbot polyvalent (Rosny + questions générales)
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
    
    if (!apiKey) {
      console.error(' OPENROUTER_API_KEY n\'est pas configurée');
      return res.status(500).json({ 
        success: false, 
        message: 'Configuration API manquante.' 
      });
    }

    // Fonction pour détecter si c'est une question sur Rosny
    function isAboutRosny(text) {
      const lowerText = text.toLowerCase();
      const rosnyKeywords = [
        'rosny', 'otsina', 'développeur', 'freelance', 'portfolio',
        'compétence', 'projet', 'contact', 'email', 'téléphone',
        'github', 'linkedin', 'cv', 'expérience', 'formation',
        'service', 'tarif', 'prix', 'mission', 'client',
        'html', 'css', 'javascript', 'php', 'laravel', 'node',
        'python', 'flutter', 'react', 'vue', 'java',
        'mysql', 'mongodb', 'base de données', 'web', 'mobile'
      ];
      
      return rosnyKeywords.some(keyword => lowerText.includes(keyword));
    }

    // Construire le système de messages adaptatif
    const messages = [];
    
    // D'abord, déterminer si c'est une question sur Rosny
    const aboutRosny = isAboutRosny(message);
    
    if (aboutRosny) {
      // Mode "Assistant de Rosny"
      messages.push({
        role: "system",
        content: `Tu es l'assistant personnel de Rosny OTSINA, développeur web et mobile freelance.

INFORMATIONS SUR ROSNY:
• Nom: Rosny OTSINA
• Profession: Développeur Full Stack Freelance
• Localisation: Libreville, Gabon
• Email: rodrigueotsina@gmail.com
• Téléphone: +241 077 12 24 85
• GitHub: https://github.com/RosnyMinko07

COMPÉTENCES TECHNIQUES:
• Frontend: HTML/CSS/JavaScript, Vue.js/React.js, Bootstrap
• Backend: PHP/Laravel, Node.js/Express.js, Python/Django, Java
• Mobile: Flutter, Android (Java/Kotlin)
• Bases de données: MySQL, PostgreSQL, MongoDB
• DevOps: Docker, CI/CD, Sécurité, Déploiement

PROJETS RÉALISÉS:
1. Application de traduction des langues gabonaises
2. Système de facturation TECH INFO PLUS
3. Application de gestion des notes
4. Shopping App & Food App (e-commerce)
5. Site immobilier complet
6. Application Permis Virtuel

SERVICES:
- Développement d'applications web et mobiles
- Création d'API REST
- Conception de bases de données
- Audit de sécurité informatique
- Maintenance et support technique
- Formation et consultation

TON RÔLE:
- Réponds en français de manière professionnelle et amicale
- Pour les questions sur Rosny, utilise les informations ci-dessus
- Pour les autres questions, réponds normalement comme un assistant IA
- Encourage le contact pour les projets professionnels
- Utilise des emojis modérément
- Sois concis mais informatif

NE DIS PAS que tu es une IA, présente-toi comme l'assistant de Rosny.`
      });
    } else {
      // Mode "Assistant général"
      messages.push({
        role: "system",
        content: `Tu es un assistant IA français polyvalent et utile.

TON STYLE:
- Tu parles français de manière claire et professionnelle
- Tu es amical mais professionnel
- Tu fournis des réponses concises mais complètes
- Tu utilises des emojis avec modération quand c'est approprié
- Tu es précis dans tes réponses
- Si tu ne sais pas quelque chose, tu l'admets honnêtement

DOMAINES DE COMPÉTENCE:
1. Informatique et programmation
2. Développement web et mobile
3. Conseils techniques
4. Aide générale et questions diverses
5. Discussions sur la technologie

RÈGLES IMPORTANTES:
- Ne donne pas de conseils médicaux, financiers ou légaux
- Sois toujours bienveillant et respectueux
- Corrige poliment les erreurs factuelles
- Encourage l'apprentissage continu

Tu peux répondre à presque toutes les questions dans ces limites.`
      });
    }

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

    let aiResponse = null;
    let usedModel = null;

    try {
      // Utiliser uniquement DeepSeek R1
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Timeout de 20 secondes pour DeepSeek

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.origin || 'https://rosny-portfolio.vercel.app'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: messages,
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          aiResponse = data.choices[0].message.content.trim();
          usedModel = 'DeepSeek R1';
        }
      } else {
        const errorData = await response.text();
        console.error('Erreur DeepSeek:', errorData);
        throw new Error(`Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur avec DeepSeek R1:', error.message);
      
      // Fallback en cas d'erreur
      if (aboutRosny) {
        // Fallback pour questions sur Rosny
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('téléphone')) {
          aiResponse = " **Contact de Rosny OTSINA :**\n\n" +
                      "• Email : rodrigueotsina@gmail.com\n" +
                      "• Téléphone : +241 077 12 24 85\n" +
                      "• Localisation : Libreville, Gabon\n" +
                      "• GitHub : github.com/RosnyMinko07\n\n" +
                      "Disponible pour vos projets web et mobile ! ";
        } else if (lowerMessage.includes('compétence') || lowerMessage.includes('technique')) {
          aiResponse = "💼 **Compétences de Rosny :**\n\n" +
                      "• Développement Web (HTML/CSS/JS, React, Vue, Laravel, Node.js)\n" +
                      "• Développement Mobile (Flutter, Android)\n" +
                      "• Bases de données (MySQL, MongoDB)\n" +
                      "• Sécurité & DevOps\n\n" +
                      "Full Stack expérimenté ! ";
        } else {
          aiResponse = "Je suis l'assistant de Rosny OTSINA, développeur freelance. Pour plus d'informations, contactez-le directement :\n" +
                      " rodrigueotsina@gmail.com |  +241 077 12 24 85\n\n" +
                      "Il peut vous aider avec vos projets de développement ! ";
        }
      } else {
        // Fallback pour questions générales
        aiResponse = "Désolé, je rencontre des difficultés techniques avec DeepSeek R1. \n\n" +
                    "En attendant, voici ce que je peux dire :\n" +
                    "• Je suis l'assistant de Rosny OTSINA, développeur freelance\n" +
                    "• Je peux répondre à des questions techniques et générales\n" +
                    "• Pour des questions spécifiques sur Rosny, contactez-le directement\n\n" +
                    "Réessayez votre question dans quelques instants !";
      }
      usedModel = 'Fallback (DeepSeek indisponible)';
    }

    return res.status(200).json({ 
      success: true, 
      message: aiResponse,
      model: usedModel,
      aboutRosny: aboutRosny
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    
    // Réponse d'erreur polyvalente
    const errorMessage = "Je rencontre des difficultés techniques. \n\n" +
                        "Pour contacter Rosny OTSINA (développeur freelance) :\n" +
                        " rodrigueotsina@gmail.com\n" +
                        " +241 077 12 24 85\n\n" +
                        "Réessayez votre question plus tard !";
    
    return res.status(500).json({ 
      success: false, 
      message: errorMessage
    });
  }
};