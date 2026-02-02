// api/chatbot.js - API backend optimisée pour la vitesse
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

    // Liste des modèles ORDONNÉS PAR VITESSE (du plus rapide au plus lent)
    const models = [
      {
        name: 'Qwen 2.5 3B',
        id: 'qwen/qwen-2.5-3b-instruct:free',
        priority: 1,
        timeout: 5000
      },
      {
        name: 'Mistral Free',
        id: 'mistralai/mistral-7b-instruct:free',
        priority: 2,
        timeout: 7000
      },
      {
        name: 'Gemma 3 27B',
        id: 'google/gemma-3-27b-it:free',
        priority: 3,
        timeout: 10000
      },
      {
        name: 'DeepSeek R1',
        id: 'deepseek/deepseek-r1-0528:free',
        priority: 4,
        timeout: 15000
      }
    ];

    // Trier par priorité (du plus rapide au plus lent)
    models.sort((a, b) => a.priority - b.priority);

    let lastError = null;
    let aiResponse = null;
    let usedModel = null;

    // Essayer chaque modèle jusqu'à ce qu'un fonctionne
    for (const model of models) {
      try {
        console.log(`⚡ Essai avec ${model.name} (le plus rapide d'abord)...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), model.timeout);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': req.headers.origin || 'https://rosny-portfolio.vercel.app',
            'X-Title': 'Portfolio Rosny OTSINA',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model.id,
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ ${model.name} indisponible: ${response.status}`);
          continue; // Essayer le modèle suivant
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error(`❌ Réponse invalide de ${model.name}`);
          continue;
        }

        aiResponse = data.choices[0].message.content.trim();
        usedModel = model.name;
        console.log(`✅ Réponse rapide reçue de ${model.name}`);
        break; // Sortir de la boucle si succès
        
      } catch (error) {
        console.error(`⏱️ ${model.name} timeout/erreur: ${error.message}`);
        lastError = error;
        continue; // Essayer le modèle suivant
      }
    }

    // Si aucun modèle n'a fonctionné
    if (!aiResponse) {
      console.error('❌ Tous les modèles ont échoué:', lastError?.message);
      
      // Message d'erreur avec informations de contact
      const fallbackMessage = `Désolé, le service IA est temporairement indisponible. 🛠️

En attendant, voici comment contacter Rosny directement :

📧 **Email** : rodrigueotsina@gmail.com
📱 **Téléphone** : +241 077 12 24 85
📍 **Localisation** : Libreville, Gabon
💻 **GitHub** : https://github.com/RosnyMinko07

**Compétences principales** :
• Développement Web & Mobile
• Conception de bases de données
• Sécurité informatique
• Maintenance et déploiement

**Disponible immédiatement** pour vos projets en freelance ! 🚀`;
      
      return res.status(200).json({ 
        success: true, 
        message: fallbackMessage,
        fallback: true
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: aiResponse,
      model: usedModel
    });
    
  } catch (error) {
    console.error('Erreur globale dans l\'API chatbot:', error);
    
    // Message d'erreur générique avec infos de contact
    const errorMessage = `Désolé, une erreur technique est survenue. ⚠️

Vous pouvez contacter Rosny directement :
• Email : rodrigueotsina@gmail.com
• Téléphone : +241 077 12 24 85
• GitHub : RosnyMinko07

Il est disponible pour vos projets en développement web et mobile ! 💻📱`;
    
    return res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message
    });
  }
};