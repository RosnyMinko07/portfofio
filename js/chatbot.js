// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
  // Éléments du DOM
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  
  // Données de Rosny pour le contexte
  const rosnyData = {
    // ... (garder les mêmes données)
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
      // ... (garder les autres projets)
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

  // Historique de conversation
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
      // Appeler notre API backend Vercel
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory.slice(-6) // Garder 6 derniers messages
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        data = { 
          success: false, 
          message: `Erreur serveur (${response.status}): ${text || 'Réponse invalide'}` 
        };
      }

      // Retirer le message de chargement
      loadingMessage.remove();

      if (response.ok && data.success) {
        // Ajouter la réponse de l'IA
        addMessage(data.message, 'bot');
        conversationHistory.push({ role: 'assistant', content: data.message });
      } else {
        let errorMsg = data.message || `Erreur serveur (${response.status}). Veuillez réessayer.`;
        
        // Si c'est une erreur de configuration API
        if (data.message && data.message.includes('OPENROUTER_API_KEY')) {
          errorMsg = '⚠️ La clé API OpenRouter n\'est pas configurée sur Vercel.\n\nPour corriger:\n1. Allez sur vercel.com\n2. Votre projet → Settings → Environment Variables\n3. Ajoutez OPENROUTER_API_KEY avec votre clé\n4. Redéployez';
        }
        
        addMessage(errorMsg, 'bot');
      }
    } catch (error) {
      loadingMessage.remove();
      
      let errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      if (error.message && error.message.includes('HTTP error')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques instants.';
      }
      addMessage(errorMessage, 'bot');
      console.error('Erreur:', error);
    } finally {
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }
  }

  // Ajouter message au chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    if (text === '...') {
      messageDiv.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
    } else {
      // Formater les sauts de ligne
      messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    }
    
    chatbotMessages.appendChild(messageDiv);
    messageDiv.style.animation = 'messageAppear 0.3s ease';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
  }

  // Message de bienvenue
  setTimeout(() => {
    if (!sessionStorage.getItem('chatbotWelcomed')) {
      addMessage("👋 Bonjour ! Je suis l'assistant IA de Rosny OTSINA. Je peux vous parler de ses compétences, projets et services. Comment puis-je vous aider ?", 'bot');
      sessionStorage.setItem('chatbotWelcomed', 'true');
    }
  }, 1000);
});