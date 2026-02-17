// chatbot.js - Version avec Avatar Féminin et Synthèse Vocale
document.addEventListener('DOMContentLoaded', function() {
  // Éléments du DOM
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.getElementById('chatbot-close-btn');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const voiceToggle = document.getElementById('chatbot-voice-toggle');
  
  // URLs des images (à remplacer par vos propres images)
  const avatarImages = {
    main: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&auto=format', // Femme professionnelle
    toggle: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&auto=format' // Avatar pour le bouton
  };
  
  // Appliquer les images
  document.getElementById('chatbot-avatar-img').src = avatarImages.main;
  document.getElementById('chatbot-toggle-img').src = avatarImages.toggle;
  
  // Configuration de la synthèse vocale (voix féminine)
  let synth = window.speechSynthesis;
  let voiceEnabled = true;
  let currentUtterance = null;
  
  // Fonction pour obtenir une voix féminine
  function getFemaleVoice() {
    return new Promise((resolve) => {
      // Attendre que les voix soient chargées
      if (synth.getVoices().length > 0) {
        const voices = synth.getVoices();
        // Chercher une voix féminine française d'abord
        let femaleVoice = voices.find(voice => 
          (voice.lang.includes('fr') && voice.name.toLowerCase().includes('female')) ||
          (voice.lang.includes('fr') && voice.name.toLowerCase().includes('féminine')) ||
          (voice.lang.includes('fr') && voice.name.includes('Google français'))
        );
        
        // Sinon, prendre n'importe quelle voix féminine
        if (!femaleVoice) {
          femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria')
          );
        }
        
        // Dernier recours : première voix française
        if (!femaleVoice) {
          femaleVoice = voices.find(voice => voice.lang.includes('fr'));
        }
        
        resolve(femaleVoice || voices[0]);
      } else {
        // Attendre que les voix soient chargées
        synth.addEventListener('voiceschanged', () => {
          const voices = synth.getVoices();
          const femaleVoice = voices.find(voice => 
            voice.lang.includes('fr') || voice.name.toLowerCase().includes('female')
          );
          resolve(femaleVoice || voices[0]);
        }, { once: true });
      }
    });
  }
  
  // Fonction pour parler avec voix féminine
  async function speakWithFemaleVoice(text) {
    if (!voiceEnabled || !synth) return;
    
    // Arrêter la parole en cours
    if (currentUtterance) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95; // Légèrement plus lent
    utterance.pitch = 1.2; // Voix plus féminine (plus aiguë)
    utterance.volume = 1;
    
    // Obtenir une voix féminine
    const femaleVoice = await getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Événements
    utterance.onstart = () => {
      currentUtterance = utterance;
      // Mettre à jour l'UI
      voiceToggle.innerHTML = '<i class="fas fa-stop"></i>';
      voiceToggle.classList.add('active');
    };
    
    utterance.onend = () => {
      currentUtterance = null;
      voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      voiceToggle.classList.remove('active');
    };
    
    utterance.onerror = () => {
      currentUtterance = null;
      voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      voiceToggle.classList.remove('active');
    };
    
    synth.speak(utterance);
  }
  
  // Arrêter la parole
  function stopSpeaking() {
    if (currentUtterance) {
      synth.cancel();
      currentUtterance = null;
      voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      voiceToggle.classList.remove('active');
    }
  }
  
  // Données de Rosny pour le contexte
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
        nom: "Plateforme de streaming pour artistes gabonais",
        desc: "Plateforme dédiée à la promotion des artistes locaux"
      },
      {
        nom: "Portfolio professionnel",
        desc: "Site web responsive présentant les compétences et projets"
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
  
  // Toggle vocal
  voiceToggle.addEventListener('click', () => {
    if (currentUtterance) {
      stopSpeaking();
    } else {
      voiceEnabled = !voiceEnabled;
      voiceToggle.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    }
  });

  function toggleChatbot() {
    chatbotContainer.classList.toggle('open');
    if (chatbotContainer.classList.contains('open')) {
      chatbotInput.focus();
    }
  }

  function closeChatbot() {
    chatbotContainer.classList.remove('open');
    stopSpeaking(); // Arrêter la voix en fermant
  }

  // Historique de conversation
  let conversationHistory = [];

  // Fonction pour ajouter un message avec avatar
  function addMessage(text, sender, playVoice = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${sender}-wrapper`;
    
    // Ajouter l'avatar pour les messages du bot
    if (sender === 'bot') {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.innerHTML = `<img src="${avatarImages.main}" alt="Sophia">`;
      messageWrapper.appendChild(avatarDiv);
    } else {
      // Avatar utilisateur (optionnel)
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.innerHTML = `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format" alt="User">`;
      messageWrapper.appendChild(avatarDiv);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    if (text === '...') {
      messageDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    } else {
      messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    }
    
    messageContent.appendChild(messageDiv);
    
    // Ajouter les contrôles audio pour les messages du bot
    if (sender === 'bot' && text !== '...') {
      const audioControl = document.createElement('div');
      audioControl.className = 'message-audio-control';
      
      const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      audioControl.innerHTML = `
        <button class="audio-play-btn" onclick="playMessageAudio(this, '${text.replace(/'/g, "\\'")}')">
          <i class="fas fa-play"></i>
        </button>
        <span class="message-time">${time}</span>
      `;
      
      messageContent.appendChild(audioControl);
      
      // Jouer automatiquement si demandé
      if (playVoice && voiceEnabled) {
        setTimeout(() => {
          speakWithFemaleVoice(text);
        }, 100);
      }
    } else if (sender === 'user') {
      const timeSpan = document.createElement('span');
      timeSpan.className = 'message-time';
      timeSpan.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      messageContent.appendChild(timeSpan);
    }
    
    messageWrapper.appendChild(messageContent);
    chatbotMessages.appendChild(messageWrapper);
    
    // Animation
    messageWrapper.style.animation = 'fadeInUp 0.3s ease';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
  }

  // Fonction globale pour jouer l'audio d'un message
  window.playMessageAudio = function(button, text) {
    const isPlaying = button.classList.contains('playing');
    
    if (isPlaying) {
      stopSpeaking();
      button.classList.remove('playing');
      button.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      // Arrêter tous les autres boutons
      document.querySelectorAll('.audio-play-btn').forEach(btn => {
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-play"></i>';
      });
      
      button.classList.add('playing');
      button.innerHTML = '<i class="fas fa-stop"></i>';
      
      speakWithFemaleVoice(text);
      
      // Réinitialiser le bouton à la fin
      const checkInterval = setInterval(() => {
        if (!currentUtterance) {
          button.classList.remove('playing');
          button.innerHTML = '<i class="fas fa-play"></i>';
          clearInterval(checkInterval);
        }
      }, 100);
    }
  };

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
    
    // Afficher indicateur de frappe avec avatar
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'message-wrapper bot-wrapper';
    typingWrapper.innerHTML = `
      <div class="message-avatar">
        <img src="${avatarImages.main}" alt="Sophia">
      </div>
      <div class="message-content">
        <div class="chatbot-message bot">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
    chatbotMessages.appendChild(typingWrapper);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
      // Appeler l'API backend
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory.slice(-6)
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

      // Retirer l'indicateur de frappe
      typingWrapper.remove();

      if (response.ok && data.success) {
        // Ajouter la réponse de l'IA avec voix
        addMessage(data.message, 'bot', voiceEnabled);
        conversationHistory.push({ role: 'assistant', content: data.message });
      } else {
        let errorMsg = data.message || `Erreur serveur (${response.status}). Veuillez réessayer.`;
        
        if (data.message && data.message.includes('OPENROUTER_API_KEY')) {
          errorMsg = '⚠️ La clé API OpenRouter n\'est pas configurée.';
        }
        
        addMessage(errorMsg, 'bot');
        if (voiceEnabled) speakWithFemaleVoice(errorMsg);
      }
    } catch (error) {
      typingWrapper.remove();
      
      let errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      addMessage(errorMessage, 'bot');
      if (voiceEnabled) speakWithFemaleVoice(errorMessage);
      console.error('Erreur:', error);
    } finally {
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }
  }

  // Message de bienvenue avec voix
  setTimeout(() => {
    if (!sessionStorage.getItem('chatbotWelcomed')) {
      const welcomeMsg = "Bonjour ! Je suis Sophia, l'assistante IA de Rosny OTSINA. Je peux vous parler de ses compétences, projets et services. Comment puis-je vous aider aujourd'hui ?";
      // La voix est déjà jouée dans le HTML initial via l'événement onclick
      sessionStorage.setItem('chatbotWelcomed', 'true');
    }
  }, 1000);
});