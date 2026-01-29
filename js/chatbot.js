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

  // Historique de conversation pour le contexte
  let conversationHistory = [];

  // Envoyer un message
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Ajouter message utilisateur
    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    // Afficher un indicateur de chargement
    const loadingMessage = addMessage('...', 'bot');
    loadingMessage.classList.add('loading');

    try {
      // Appeler l'API backend
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory.slice(-5) // Garder seulement les 5 derniers messages pour le contexte
        })
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Retirer le message de chargement
      loadingMessage.remove();

      if (data.success) {
        // Ajouter la réponse de l'IA
        addMessage(data.message, 'bot');
        conversationHistory.push({ role: 'assistant', content: data.message });
      } else {
        // En cas d'erreur, afficher le message d'erreur de l'API
        const errorMsg = data.message || 'Désolé, une erreur est survenue. Veuillez réessayer.';
        addMessage(errorMsg, 'bot');
        console.error('Erreur API:', data);
        if (data.error) {
          console.error('Détails de l\'erreur:', data.error);
        }
      }
    } catch (error) {
      // Retirer le message de chargement
      loadingMessage.remove();
      
      // En cas d'erreur réseau, afficher un message d'erreur
      let errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      if (error.message && error.message.includes('HTTP error')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques instants.';
      }
      addMessage(errorMessage, 'bot');
      console.error('Erreur réseau:', error);
      console.error('Détails:', error.message);
    } finally {
      // Réactiver l'input
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }
  }

  // Ajouter message au chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    // Si c'est un message de chargement, ajouter une animation
    if (text === '...') {
      messageDiv.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
    } else {
      messageDiv.textContent = text;
    }
    
    chatbotMessages.appendChild(messageDiv);
    
    // Animation
    messageDiv.style.animation = 'messageAppear 0.3s ease';
    
    // Scroll automatique
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
  }

  // Note: Les réponses sont maintenant générées par l'API backend avec Google Gemini
  // Les données rosnyData sont conservées pour référence mais ne sont plus utilisées directement

  // Ajouter un message de bienvenue après 3 secondes sur la page
  setTimeout(() => {
    if (!sessionStorage.getItem('chatbotWelcomed')) {
      addMessage("💡 Astuce : Cliquez sur le robot en bas à droite pour discuter avec l'assistant IA !", 'bot');
      sessionStorage.setItem('chatbotWelcomed', 'true');
    }
  }, 3000);
});