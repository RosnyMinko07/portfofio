// chatbot.js - Version Complète avec Avatar Animé, Voix Féminine, Projets & Certifications
document.addEventListener('DOMContentLoaded', function () {

  // ===================== ÉLÉMENTS DOM =====================
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle   = document.getElementById('chatbot-toggle');
  const chatbotClose    = document.getElementById('chatbot-close-btn');
  const chatbotInput    = document.getElementById('chatbot-input');
  const chatbotSend     = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const voiceToggle     = document.getElementById('chatbot-voice-toggle');
  const avatarImg       = document.getElementById('chatbot-avatar-img');
  const toggleImg       = document.getElementById('chatbot-toggle-img');
  // Pour changer l'avatar : remplace le chemin ci-dessous par ton image
  // Ex: const AVATAR_URL = 'images/mon-avatar.png';
  const AVATAR_URL = null; // null = utilise l'icône par défaut
  const USER_AVATAR = null;

  // Fonction pour créer un avatar (icône ou image)
  function createAvatar(isBot) {
    const div = document.createElement('div');
    div.className = 'message-avatar';
    if (isBot) {
      if (AVATAR_URL) {
        div.innerHTML = `<img src="${AVATAR_URL}" alt="Sophia">`;
      } else {
        div.innerHTML = `<div class="chatbot-avatar-icon"><i class="fas fa-robot"></i></div>`;
      }
    } else {
      if (USER_AVATAR) {
        div.innerHTML = `<img src="${USER_AVATAR}" alt="Vous">`;
      } else {
        div.innerHTML = `<div class="chatbot-avatar-icon user-icon"><i class="fas fa-user"></i></div>`;
      }
    }
    return div;
  }

  // ===================== SYNTHÈSE VOCALE =====================
  const synth = window.speechSynthesis;
  let voiceEnabled = true;
  let currentUtterance = null;
  let isSpeaking = false;

  // Nettoyer les emojis et caractères spéciaux pour la TTS
  function cleanTextForSpeech(text) {
    return text
      // Supprimer les emojis (plages Unicode)
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      // Supprimer les balises HTML
      .replace(/<[^>]*>/g, '')
      // Supprimer les caractères markdown
      .replace(/[*_~`#]/g, '')
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Obtenir une voix féminine française
  function getFemaleVoice() {
    return new Promise((resolve) => {
      const tryFind = () => {
        const voices = synth.getVoices();
        if (!voices.length) return null;

        // Priorité 1 : voix féminine française explicite
        let v = voices.find(v =>
          v.lang.startsWith('fr') && (
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('féminin') ||
            v.name.toLowerCase().includes('amélie') ||
            v.name.toLowerCase().includes('thomas') === false
          )
        );
        // Priorité 2 : Google Français
        if (!v) v = voices.find(v => v.name.includes('Google français') || v.name.includes('Google French'));
        // Priorité 3 : n'importe quelle voix française
        if (!v) v = voices.find(v => v.lang.startsWith('fr'));
        // Priorité 4 : voix féminine générique
        if (!v) v = voices.find(v =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('karen')
        );
        return v || voices[0];
      };

      const found = tryFind();
      if (found) { resolve(found); return; }

      synth.addEventListener('voiceschanged', () => resolve(tryFind()), { once: true });
    });
  }

  // Démarrer l'animation "speaking" sur l'avatar
  function startSpeakingAnimation() {
    isSpeaking = true;
    if (avatarImg) avatarImg.closest('.chatbot-avatar')?.classList.add('avatar-speaking');
    if (toggleImg) toggleImg.closest('.chatbot-toggle-btn')?.classList.add('avatar-speaking');
    document.querySelectorAll('.message-avatar img').forEach(img => {
      img.closest('.message-avatar')?.classList.add('avatar-bounce');
    });
  }

  function stopSpeakingAnimation() {
    isSpeaking = false;
    if (avatarImg) avatarImg.closest('.chatbot-avatar')?.classList.remove('avatar-speaking');
    if (toggleImg) toggleImg.closest('.chatbot-toggle-btn')?.classList.remove('avatar-speaking');
    document.querySelectorAll('.message-avatar').forEach(el => el.classList.remove('avatar-bounce'));
  }

  // Parler avec voix féminine
  async function speakWithFemaleVoice(rawText) {
    if (!voiceEnabled || !synth) return;

    const text = cleanTextForSpeech(rawText);
    if (!text) return;

    if (currentUtterance) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang    = 'fr-FR';
    utterance.rate    = 0.92;
    utterance.pitch   = 1.15;
    utterance.volume  = 1;

    const femaleVoice = await getFemaleVoice();
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => {
      currentUtterance = utterance;
      voiceToggle.innerHTML = '<i class="fas fa-stop"></i>';
      voiceToggle.classList.add('active');
      startSpeakingAnimation();
      showSoundWaves(true);
    };

    utterance.onend = () => {
      currentUtterance = null;
      voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      voiceToggle.classList.remove('active');
      stopSpeakingAnimation();
      showSoundWaves(false);
      // Réinitialiser tous les boutons play
      document.querySelectorAll('.audio-play-btn.playing').forEach(btn => {
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-play"></i>';
      });
    };

    utterance.onerror = () => {
      currentUtterance = null;
      voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      voiceToggle.classList.remove('active');
      stopSpeakingAnimation();
      showSoundWaves(false);
    };

    synth.speak(utterance);
  }

  // Arrêter la parole
  function stopSpeaking() {
    if (synth.speaking) synth.cancel();
    currentUtterance = null;
    voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    voiceToggle.classList.remove('active');
    stopSpeakingAnimation();
    showSoundWaves(false);
    document.querySelectorAll('.audio-play-btn.playing').forEach(btn => {
      btn.classList.remove('playing');
      btn.innerHTML = '<i class="fas fa-play"></i>';
    });
  }

  // Vagues sonores
  function showSoundWaves(show) {
    const waves = document.querySelectorAll('.sound-waves');
    waves.forEach(w => w.classList.toggle('active', show));
  }

  // ===================== DONNÉES ROSNY =====================
  const projets = [
    {
      id: 1,
      nom: "Application de traduction des langues gabonaises",
      desc: "Application web responsive permettant la traduction entre différentes langues locales du Gabon. Elle inclut un dictionnaire, un module d'apprentissage et une interface communautaire.",
      tech: "HTML, CSS, JavaScript, PHP",
      date: "Décembre 2024"
    },
    {
      id: 2,
      nom: "Application Web de Facturation - Tech Info Plus",
      desc: "Système complet de facturation et de suivi de stock pour une PME à Port-Gentil. Gestion des clients, fournisseurs, articles, devis, règlements et rapports.",
      tech: "Laravel, MySQL, Bootstrap",
      date: "2024",
      lien: "https://tech-info-plus.vercel.app/"
    },
    {
      id: 3,
      nom: "Application GABON - Lieux populaires",
      desc: "Application WinDev répertoriant les endroits populaires de tout le Gabon avec système de connexion, inscription et navigation par région.",
      tech: "WinDev",
      date: "2024"
    },
    {
      id: 4,
      nom: "Application Web Mini Market",
      desc: "Plateforme e-commerce pour la gestion d'un mini market en ligne avec espace vendeur, panier, paiement et tableau de bord administrateur.",
      tech: "HTML, CSS, JavaScript, PHP, MySQL",
      date: "Projet scolaire"
    },
    {
      id: 5,
      nom: "Application Mobile de Vote",
      desc: "Application mobile Flutter pour la réalisation de votes électroniques en temps réel avec interface administrateur et saisie des résultats.",
      tech: "Flutter, Firebase",
      date: "2024"
    },
    {
      id: 6,
      nom: "Portfolio Professionnel",
      desc: "Site web portfolio responsive présentant les compétences, projets et services de Rosny OTSINA avec chatbot IA intégré et synthèse vocale.",
      tech: "HTML, CSS, JavaScript, Node.js",
      date: "2025"
    }
  ];

  const rosnyData = {
    nom: "Rosny OTSINA MINKO Jean Rodrigue Rismin",
    titre: "Développeur Web et Mobile Freelance",
    email: "rodrigueotsina@gmail.com",
    phone: "+241 077 12 24 85",
    location: "Libreville, Gabon",
    github: "https://github.com/RosnyMinko07",
    disponibilite: "Disponible immédiatement",
    formation: {
      licence: "Licence professionnelle en Informatique - INPTIC (Génie Logiciel)",
      master: "Master Intelligence Artificielle (en cours)"
    },
    competences: {
      frontend: ["HTML (Avancé)", "CSS", "JavaScript/TypeScript", "Vue.js", "React.js", "Bootstrap"],
      backend: ["PHP/Laravel", "Node.js/Express.js/NestJS", "Python (Django/FastAPI)", "Java"],
      mobile: ["Flutter", "Java/Kotlin (Android)"],
      databases: ["MySQL", "PostgreSQL", "SQLite", "MongoDB"],
      autres: ["Sécurité informatique", "Maintenance", "Déploiement", "WinDev"]
    },
    services: [
      "Développement Web (sites, applications, API)",
      "Développement Mobile (Android/iOS avec Flutter)",
      "Conception de bases de données",
      "Sécurité informatique",
      "Maintenance et support technique",
      "Déploiement et hébergement"
    ],
    projets: projets
  };

  // ===================== DÉTECTION PROJETS =====================
  const projectKeywords = [
    'projet', 'projets', 'portfolio', 'réalisation', 'travaux', 'application',
    'développé', 'créé', 'fait', 'travail', 'oeuvre', 'production'
  ];

  function isProjectRequest(message) {
    const lower = message.toLowerCase();
    return projectKeywords.some(kw => lower.includes(kw));
  }

  function buildProjectsResponse() {
    let response = "Voici les 6 projets de Rosny OTSINA :\n\n";
    projets.forEach((p, i) => {
      response += `${i + 1}. ${p.nom}\n`;
      response += `   ${p.desc}\n`;
      response += `   Technologies : ${p.tech}\n`;
      if (p.lien) response += `   Lien : ${p.lien}\n`;
      response += '\n';
    });
    response += "Vous pouvez voir tous ces projets dans la section Portfolio du site !";
    return response;
  }

  // ===================== RÉPONSES LOCALES =====================
  function getLocalResponse(message) {
    const lower = message.toLowerCase();

    if (isProjectRequest(lower)) {
      return buildProjectsResponse();
    }

    if (lower.includes('compétence') || lower.includes('competence') || lower.includes('skill') || lower.includes('technologie')) {
      return `Rosny maîtrise :\n\nFrontend : ${rosnyData.competences.frontend.join(', ')}\n\nBackend : ${rosnyData.competences.backend.join(', ')}\n\nMobile : ${rosnyData.competences.mobile.join(', ')}\n\nBases de données : ${rosnyData.competences.databases.join(', ')}\n\nAutres : ${rosnyData.competences.autres.join(', ')}`;
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('téléphone') || lower.includes('joindre')) {
      return `Pour contacter Rosny :\n\nEmail : ${rosnyData.email}\nTéléphone : ${rosnyData.phone}\nLocalisation : ${rosnyData.location}\nGitHub : ${rosnyData.github}\nDisponibilité : ${rosnyData.disponibilite}`;
    }

    if (lower.includes('service') || lower.includes('offre') || lower.includes('propose')) {
      return `Rosny propose les services suivants :\n\n${rosnyData.services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    }

    if (lower.includes('formation') || lower.includes('étude') || lower.includes('diplôme') || lower.includes('université')) {
      return `Formation de Rosny :\n\n${rosnyData.formation.licence}\n\n${rosnyData.formation.master}`;
    }

    if (lower.includes('qui') && (lower.includes('rosny') || lower.includes('toi') || lower.includes('vous'))) {
      return `Je suis Sophia, l'assistante IA de ${rosnyData.nom}. Il est ${rosnyData.titre} basé à ${rosnyData.location}. Il est ${rosnyData.disponibilite} pour vos projets !`;
    }

    if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello') || lower.includes('bonsoir')) {
      return `Bonjour ! Je suis Sophia, l'assistante IA de Rosny OTSINA. Comment puis-je vous aider aujourd'hui ? Je peux vous parler de ses projets, compétences, services ou vous donner ses coordonnées.`;
    }

    if (lower.includes('merci') || lower.includes('thank')) {
      return `De rien ! N'hésitez pas si vous avez d'autres questions sur Rosny ou ses projets.`;
    }

    return null; // Passer à l'API
  }

  // ===================== INTERFACE =====================
  chatbotToggle.addEventListener('click', toggleChatbot);
  chatbotClose.addEventListener('click', closeChatbot);

  voiceToggle.addEventListener('click', () => {
    if (synth.speaking) {
      stopSpeaking();
    } else {
      voiceEnabled = !voiceEnabled;
      voiceToggle.innerHTML = voiceEnabled
        ? '<i class="fas fa-volume-up"></i>'
        : '<i class="fas fa-volume-mute"></i>';
      voiceToggle.title = voiceEnabled ? 'Désactiver la voix' : 'Activer la voix';
    }
  });

  function toggleChatbot() {
    chatbotContainer.classList.toggle('open');
    if (chatbotContainer.classList.contains('open')) {
      chatbotInput.focus();
      chatbotToggle.classList.add('open');
    } else {
      chatbotToggle.classList.remove('open');
      stopSpeaking();
    }
  }

  function closeChatbot() {
    chatbotContainer.classList.remove('open');
    chatbotToggle.classList.remove('open');
    stopSpeaking();
  }

  // ===================== MESSAGES =====================
  let conversationHistory = [];

  function addMessage(text, sender, playVoice = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${sender}-wrapper`;

    // Avatar
    const avatarDiv = createAvatar(sender === 'bot');
    wrapper.appendChild(avatarDiv);

    // Contenu
    const content = document.createElement('div');
    content.className = 'message-content';

    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${sender}`;

    if (text === '...') {
      msgDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    } else {
      msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    }

    content.appendChild(msgDiv);

    // Contrôles audio + horodatage pour les messages bot
    if (sender === 'bot' && text !== '...') {
      const audioCtrl = document.createElement('div');
      audioCtrl.className = 'message-audio-control';

      const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const safeText = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      audioCtrl.innerHTML = `
        <button class="audio-play-btn" data-text="${safeText}" title="Lire ce message">
          <i class="fas fa-play"></i>
        </button>
        <div class="sound-waves">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <span class="message-time">${time}</span>
      `;

      // Attacher l'événement directement (évite les problèmes d'échappement)
      const playBtn = audioCtrl.querySelector('.audio-play-btn');
      playBtn.addEventListener('click', function () {
        handlePlayButton(this, text);
      });

      content.appendChild(audioCtrl);

      if (playVoice && voiceEnabled) {
        setTimeout(() => speakWithFemaleVoice(text), 300);
      }
    } else if (sender === 'user') {
      const timeSpan = document.createElement('span');
      timeSpan.className = 'message-time';
      timeSpan.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      content.appendChild(timeSpan);
    }

    wrapper.appendChild(content);

    // Animation d'apparition
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(15px)';
    chatbotMessages.appendChild(wrapper);

    requestAnimationFrame(() => {
      wrapper.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return msgDiv;
  }

  function handlePlayButton(button, text) {
    const isPlaying = button.classList.contains('playing');

    // Arrêter tous les autres
    document.querySelectorAll('.audio-play-btn.playing').forEach(btn => {
      if (btn !== button) {
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });

    if (isPlaying) {
      stopSpeaking();
      button.classList.remove('playing');
      button.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      button.classList.add('playing');
      button.innerHTML = '<i class="fas fa-stop"></i>';
      speakWithFemaleVoice(text);

      // Surveiller la fin
      const check = setInterval(() => {
        if (!synth.speaking) {
          button.classList.remove('playing');
          button.innerHTML = '<i class="fas fa-play"></i>';
          clearInterval(check);
        }
      }, 200);
    }
  }

  // Exposer globalement pour compatibilité
  window.playMessageAudio = function (button, text) {
    handlePlayButton(button, text);
  };

  // ===================== ENVOI MESSAGE =====================
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // Indicateur de frappe en temps réel
  let typingTimer;
  chatbotInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    chatbotInput.classList.add('typing');
    typingTimer = setTimeout(() => chatbotInput.classList.remove('typing'), 1000);
  });

  async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;

    // Indicateur de frappe
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'message-wrapper bot-wrapper typing-msg';
    const typingAvatar = createAvatar(true);
    typingWrapper.appendChild(typingAvatar);
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = `<div class="chatbot-message bot"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    typingWrapper.appendChild(typingContent);
    chatbotMessages.appendChild(typingWrapper);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Vérifier réponse locale d'abord
    const localResp = getLocalResponse(message);

    if (localResp) {
      await new Promise(r => setTimeout(r, 600)); // Délai naturel
      typingWrapper.remove();
      addMessage(localResp, 'bot', voiceEnabled);
      conversationHistory.push({ role: 'assistant', content: localResp });
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
      return;
    }

    // Appel API
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.slice(-6)
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: `Erreur serveur (${response.status})` };
      }

      typingWrapper.remove();

      if (response.ok && data.success) {
        addMessage(data.message, 'bot', voiceEnabled);
        conversationHistory.push({ role: 'assistant', content: data.message });
      } else {
        const errMsg = data.message || 'Une erreur est survenue. Veuillez réessayer.';
        addMessage(errMsg, 'bot', voiceEnabled);
      }
    } catch {
      typingWrapper.remove();
      const errMsg = 'Erreur de connexion. Vérifiez votre connexion internet.';
      addMessage(errMsg, 'bot', voiceEnabled);
    } finally {
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }
  }

  // ===================== MESSAGE DE BIENVENUE =====================
  setTimeout(() => {
    if (!sessionStorage.getItem('chatbotWelcomed')) {
      sessionStorage.setItem('chatbotWelcomed', 'true');
      // Le message est déjà dans le HTML, on joue juste la voix si activée
    }
  }, 1500);

});
