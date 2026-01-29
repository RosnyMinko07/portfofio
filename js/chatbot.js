// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
  // Éléments du DOM
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  
  // Données de Rosny pour les réponses
  const rosnyData = {
    competences: {
      frontend: ["HTML (Avancé)", "CSS (Intermédiaire)", "JavaScript/TypeScript", "Vue.js/React.js/Bootstrap"],
      backend: ["PHP/Laravel", "Node.js/Express.js/NestJS", "Python (Django/FastAPI)", "Java"],
      mobile: ["Flutter", "Java/Kotlin (Android)"],
      databases: ["MySQL/PostgreSQL/SQLite", "MongoDB"],
      autres: ["Sécurité informatique", "Maintenance", "Déploiement"]
    },
    projets: [
      {
        nom: "Application de traduction des langues gabonaises",
        desc: "Application innovante pour préserver et traduire les langues locales"
      },
      {
        nom: "Système de facturation TECH INFO PLUS",
        desc: "Application web de facturation et suivi de stock pour PME"
      },
      {
        nom: "Application de gestion des notes",
        desc: "Application multiplateforme pour suivre les notes étudiants"
      },
      {
        nom: "Shopping App & Food App",
        desc: "Applications mobiles e-commerce avec panier et notifications"
      },
      {
        nom: "Site immobilier",
        desc: "Plateforme complète avec inscription, connexion et gestion d'annonces"
      },
      {
        nom: "Permis Virtuel",
        desc: "Application web pour permis de conduire dématérialisés"
      }
    ],
    services: [
      "Développement Web (sites, applications, API)",
      "Développement Mobile (Android/iOS avec Flutter)",
      "Conception de bases de données",
      "Sécurité informatique",
      "Maintenance et support technique",
      "Déploiement et hébergement"
    ],
    contact: {
      email: "rodrigueotsina@gmail.com",
      phone: "+241 077 12 24 85",
      location: "Libreville, Gabon",
      github: "https://github.com/RosnyMinko07",
      freelance: "Disponible immédiatement"
    },
    formation: {
      licence: "Licence professionnelle en Informatique - INPTIC",
      master: "Master Intelligence Artificielle (en cours)",
      specialisation: "Génie Logiciel"
    }
  };

  // Ouvrir/fermer le chatbot
  chatbotToggle.addEventListener('click', toggleChatbot);
  chatbotClose.addEventListener('click', closeChatbot);

  function toggleChatbot() {
    chatbotContainer.classList.toggle('open');
  }

  function closeChatbot() {
    chatbotContainer.classList.remove('open');
  }

  // Envoyer un message
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Ajouter message utilisateur
    addMessage(message, 'user');
    chatbotInput.value = '';
    chatbotInput.focus();

    // Réponse IA (simulée avec délai réaliste)
    setTimeout(() => {
      const response = generateAIResponse(message);
      addMessage(response, 'bot');
    }, 800 + Math.random() * 700); // Délai aléatoire entre 800-1500ms
  }

  // Ajouter message au chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    
    // Animation
    messageDiv.style.animation = 'messageAppear 0.3s ease';
    
    // Scroll automatique
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Générer réponse IA basée sur les mots-clés
  function generateAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Salutations
    if (msg.match(/(bonjour|salut|coucou|hello|hi)/)) {
      return `Bonjour ! Je suis l'assistant IA de Rosny OTSINA. Je peux vous parler de :
• Ses compétences techniques
• Ses projets réalisés
• Les services qu'il propose
• Son parcours et formation
• Comment le contacter

Que souhaitez-vous savoir ? 😊`;
    }
    
    // Compétences techniques
    if (msg.match(/(compétence|sait faire|technique|maîtrise|langage|framework)/)) {
      return `Rosny maîtrise un large éventail de technologies :

🎨 FRONTEND :
${rosnyData.competences.frontend.map(t => `• ${t}`).join('\n')}

⚙️ BACKEND :
${rosnyData.competences.backend.map(t => `• ${t}`).join('\n')}

📱 MOBILE :
${rosnyData.competences.mobile.map(t => `• ${t}`).join('\n')}

🗄️ BASES DE DONNÉES :
${rosnyData.competences.databases.map(t => `• ${t}`).join('\n')}

🛡️ AUTRES :
${rosnyData.competences.autres.map(t => `• ${t}`).join('\n')}

Il est spécialisé dans le développement full-stack et les applications multiplateformes.`;
    }
    
    // Projets
    if (msg.match(/(projet|réalisation|portfolio|travail|application)/)) {
      return `Voici quelques projets réalisés par Rosny :

${rosnyData.projets.map((p, i) => `📌 ${p.nom}\n   ${p.desc}`).join('\n\n')}

Il a une expérience concrète dans le développement d'applications complètes, du backend au frontend.`;
    }
    
    // Services
    if (msg.match(/(service|offre|tarif|prix|mission|prestation)/)) {
      return `Rosny propose les services suivants :

${rosnyData.services.map(s => `✅ ${s}`).join('\n')}

Il travaille en freelance et peut intervenir sur tous types de projets web et mobile. Pour un devis personnalisé, contactez-le directement.`;
    }
    
    // Contact
    if (msg.match(/(contact|email|téléphone|phone|appeler|joindre|disponible)/)) {
      return `Pour contacter Rosny :

📧 Email : ${rosnyData.contact.email}
📱 Téléphone : ${rosnyData.contact.phone}
📍 Localisation : ${rosnyData.contact.location}
💼 Statut : ${rosnyData.contact.freelance}
🐙 GitHub : ${rosnyData.contact.github}

N'hésitez pas à lui envoyer un message pour discuter de votre projet !`;
    }
    
    // Formation/Études
    if (msg.match(/(formation|études|diplôme|parcours|école|université)/)) {
      return `Parcours académique de Rosny :

🎓 ${rosnyData.formation.licence}
🎓 ${rosnyData.formation.master}
💡 Spécialisation : ${rosnyData.formation.specialisation}

Il combine une solide formation théorique avec une expérience pratique en développement.`;
    }
    
    // À propos
    if (msg.match(/(qui est|présente|parle-moi de toi|à propos)/)) {
      return `Rosny OTSINA est un développeur web et mobile freelance passionné par la création d'applications robustes et innovantes.

Son approche :
• Développement complet (backend + frontend + mobile)
• Code propre, maintenable et documenté
• Solutions sur mesure adaptées aux besoins
• Suivi rigoureux et professionnel

Il transforme vos idées en solutions fonctionnelles et performantes. 💻`;
    }
    
    // Merci
    if (msg.match(/(merci|thanks|thank you)/)) {
      return `Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊

Pensez à visiter la section Portfolio pour voir ses projets en détail !`;
    }
    
    // Au revoir
    if (msg.match(/(au revoir|bye|à plus|goodbye)/)) {
      return `À bientôt ! N'oubliez pas que vous pouvez :
• Télécharger son CV
• Voir ses projets détaillés
• Lui envoyer un message directement

Bonne journée ! 👋`;
    }
    
    // Réponse par défaut
    return `Je ne suis pas sûr de comprendre. Je peux vous parler de :
    
1. **Compétences** → "Quelles sont tes compétences techniques ?"
2. **Projets** → "Montre-moi tes réalisations"
3. **Services** → "Quels services proposes-tu ?"
4. **Contact** → "Comment te contacter ?"
5. **Formation** → "Quel est ton parcours ?"

Posez-moi une question plus précise ! 🤖`;
  }

  // Ajouter un message de bienvenue après 3 secondes sur la page
  setTimeout(() => {
    if (!sessionStorage.getItem('chatbotWelcomed')) {
      addMessage("💡 Astuce : Cliquez sur le robot en bas à droite pour discuter avec l'assistant IA !", 'bot');
      sessionStorage.setItem('chatbotWelcomed', 'true');
    }
  }, 3000);
});