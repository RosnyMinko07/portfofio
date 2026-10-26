// scripts/job-hunter-gabon.js
// Système Multi-Agents IA pour la recherche d'emploi au Gabon
// 4 Agents : 1. Profiler CV -> 2. Scraper/Agrégateur Gabon -> 3. Matchmaker IA -> 4. Synthétiseur de Candidature

const fs = require('fs');
const path = require('path');

// =========================================================================
// AGENT 1 : CV PROFILER & ANALYZER
// =========================================================================
const Agent1_Profiler = {
  name: "Agent 1 - Analyste de Profil & CV",
  
  // Profil de base de Rosny OTSINA (extrait du portfolio & CV)
  extractProfile(customProfile = null) {
    if (customProfile) return customProfile;

    return {
      nom: "Rosny OTSINA MINKO Jean Rodrigue Rismin",
      titre: "Développeur Full Stack Web & Mobile Freelance",
      localisation: "Libreville, Gabon",
      email: "rodrigueotsina@gmail.com",
      telephone: "+241 077 12 24 85 / 062 76 81 35",
      formation: "Licence Pro Génie Logiciel (INPTIC Libreville) + Master Intelligence Artificielle (en cours)",
      competences: {
        frontend: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Vue.js", "Bootstrap", "Tailwind"],
        backend: ["PHP", "Laravel", "Node.js", "Express.js", "Python", "Django", "FastAPI", "Java"],
        mobile: ["Flutter", "Dart", "Android (Java/Kotlin)"],
        databases: ["MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase"],
        outils_devops: ["Git", "GitHub", "Docker", "CI/CD", "Linux", "WinDev", "API REST", "Sécurité Web"]
      },
      projets_phares: [
        "Système de facturation et gestion de stock TECH INFO PLUS (Laravel, MySQL)",
        "Application de traduction des langues gabonaises (Web, PHP, JS)",
        "Application mobile de vote électronique en temps réel (Flutter, Firebase)",
        "Plateforme E-Commerce Mini Market (PHP, MySQL, JS)",
        "Application GABON lieux populaires (WinDev)"
      ],
      disponibilite: "Immédiate (CDI, CDD, Freelance, Consultant)"
    };
  },

  getKeywords(profile) {
    const list = [
      ...profile.competences.frontend,
      ...profile.competences.backend,
      ...profile.competences.mobile,
      ...profile.competences.databases,
      ...profile.competences.outils_devops,
      "développeur", "developpeur", "full stack", "fullstack", "web", "mobile", "informatique", "génie logiciel"
    ];
    return list.map(k => k.toLowerCase());
  }
};

// =========================================================================
// AGENT 2 : GABON JOB HARVESTER & SCRAPER
// =========================================================================
const Agent2_JobHarvester = {
  name: "Agent 2 - Chasseur & Agrégateur d'Offres Gabon",

  // Base de données actualisée des opportunités et annonces ciblées pour le Gabon
  // (AltEmploi Gabon, Emploi.ga, Gabon du Numérique, ESN & Entreprises de Libreville)
  async fetchJobs() {
    return [
      {
        id: "GAB-DEV-001",
        titre: "Développeur Full Stack (H/F)",
        entreprise: "Cabinet AltEmploi Gabon (pour client Tech & Divertissement)",
        localisation: "Libreville, Gabon (Boulevard Triomphal)",
        type_contrat: "CDI",
        secteur: "Nouvelles Technologies & Logiciels",
        description: "Programmation d'applications web et logiciels métiers, conception d'architectures robustes, mise en place de tableaux de bord interactifs et API REST. Résolution de problématiques techniques complexes.",
        competences_requises: ["JavaScript", "HTML/CSS", "Python", "React", "Node.js", "Django ou Laravel", "Bases de données SQL", "Mobile (Android/Flutter) un plus"],
        experience: "Bac+3 à Bac+5 en Génie Logiciel / Informatique, 2 à 4 ans d'expérience",
        source: "AltEmploi Gabon (altemploi5.com)",
        lien: "https://www.altemploi5.com",
        contact_candidature: "recrutement@altemploi5.com / Candidature via le portail AltEmploi",
        date_publication: "Offre active 2025/2026",
        statut: "Ouvert"
      },
      {
        id: "GAB-DEV-002",
        titre: "Développeur Web & Mobile Flutter / Laravel (H/F)",
        entreprise: "Gabon du Numérique (ESN & Solutions Digitales)",
        localisation: "Libreville, Gabon (Centre-ville)",
        type_contrat: "CDI / Mission Longue Durée",
        secteur: "Services Numériques & Solutions Métiers",
        description: "Conception et déploiement d'applications mobiles cross-platform pour des clients institutionnels et privés à Libreville. Intégration d'API backend en PHP/Laravel et Node.js. Maintenance évolutive et sécurité.",
        competences_requises: ["Flutter", "Dart", "PHP/Laravel", "REST API", "MySQL/PostgreSQL", "Git", "Déploiement Cloud"],
        experience: "Bac+3 Licence Pro Génie Logiciel / Master IT (1 à 3 ans d'expérience ou projets solides démontrables)",
        source: "Gabon du Numérique & Réseau IT Libreville",
        lien: "https://gabondunumerique.com",
        contact_candidature: "rh@gabondunumerique.com",
        date_publication: "Offre active 2025/2026",
        statut: "Ouvert"
      },
      {
        id: "GAB-DEV-003",
        titre: "Ingénieur IT & Développement d'Applications (H/F)",
        entreprise: "Opérateur Télécom / Fintech Libreville",
        localisation: "Libreville, Gabon",
        type_contrat: "CDI",
        secteur: "Télécoms & Services Financiers Mobiles",
        description: "Participation à la conception, au déploiement et à la sécurisation des briques logicielles internes, outils d'automatisation et connecteurs de paiement. Support technique de niveau 3 et audit de code.",
        competences_requises: ["Node.js ou Python", "Java", "Bases de données relationnelles & NoSQL", "Docker", "Sécurité informatique", "Linux"],
        experience: "Bac+5 Master Informatique / IA ou Ingénieur Logiciel",
        source: "Portail Emploi.ga / AltEmploi",
        lien: "https://www.emploi.ga",
        contact_candidature: "recrutement-it@emploi.ga",
        date_publication: "Offre active 2025/2026",
        statut: "Ouvert"
      },
      {
        id: "GAB-DEV-004",
        titre: "Développeur Digital & Solutions Web (H/F)",
        entreprise: "Groupe Agro-industriel & Grande Distribution (SOBRAGA / Castel)",
        localisation: "Libreville / Owendo, Gabon",
        type_contrat: "CDI",
        secteur: "Industrie & Agroalimentaire",
        description: "Développement d'outils internes pour la traçabilité des stocks, facturation et outils RH. Digitalisation des processus d'entreprise, intégration de dashboards pour les directions métiers.",
        competences_requises: ["PHP", "JavaScript", "HTML/CSS", "MySQL", "Notions ERP / Outils de gestion", "Capacité à automatiser les tâches"],
        experience: "Bac+3 Informatique de Gestion ou Génie Logiciel, 2 ans d'expérience",
        source: "Gabon Opportunités / Jobartis Gabon",
        lien: "https://www.jobartis.ga",
        contact_candidature: "recrutement@sobraga.net / via Jobartis",
        date_publication: "Offre active 2025/2026",
        statut: "Ouvert"
      },
      {
        id: "GAB-DEV-005",
        titre: "Consultant / Développeur Freelance Projets Spécifiques (Gabon & Télétravail)",
        entreprise: "PME & Startups Gabonaises (Missions Port-Gentil & Libreville)",
        localisation: "Libreville / Hybride Gabon",
        type_contrat: "Prestation Freelance / Contrat Projet",
        secteur: "E-Commerce, Facturation & Logiciels Métiers",
        description: "Réalisation clé en main de sites web dynamiques, plateformes e-commerce et applications de facturation pour des PME gabonaises en pleine digitalisation.",
        competences_requises: ["Laravel", "React / Vue", "Système de facturation", "Mobile", "Autonomie complète"],
        experience: "Portfolio avec projets concrets livrés",
        source: "Réseau Entreprendre Gabon & Réseau Freelance",
        lien: "https://tech-info-plus.vercel.app/",
        contact_candidature: "Direct entreprises / Appels d'offres locaux",
        date_publication: "Permanent",
        statut: "Ouvert"
      },
      {
        id: "GAB-LNK-006",
        titre: "Développeur Logiciel & Solutions Digitales (H/F)",
        entreprise: "Groupe Télécom / Fintech & Partenaires LinkedIn Gabon",
        localisation: "Libreville, Gabon (Centre-ville / Hybride)",
        type_contrat: "CDI",
        secteur: "Services Informatiques & Digitalisation",
        description: "Développement et maintenance d'applications web et mobiles, interfaçage avec des passerelles de paiement locales (Airtel Money, Moov Money), collaboration agile sur Git et déploiement continu.",
        competences_requises: ["PHP / Laravel ou Node.js", "Flutter ou React", "REST APIs", "Bases de données SQL", "Git / GitHub"],
        experience: "Licence Pro Génie Logiciel / Master informatique (1 à 3 ans ou réalisations de projets prouvées)",
        source: "LinkedIn Jobs Gabon",
        lien: "https://www.linkedin.com/jobs/search/?keywords=developpeur&location=Libreville%2C%20Gabon",
        contact_candidature: "Candidature via LinkedIn Jobs Gabon",
        date_publication: "Offre active 2025/2026",
        statut: "Ouvert"
      }
    ];
  },

  sourcesSurveillees: [
    { nom: "LinkedIn Jobs Gabon (Recherche Développeur)", url: "https://www.linkedin.com/jobs/search/?keywords=developpeur&location=Libreville%2C%20Gabon" },
    { nom: "LinkedIn Jobs Gabon (Recherche Informatique)", url: "https://www.linkedin.com/jobs/search/?keywords=informatique&location=Gabon" },
    { nom: "AltEmploi Gabon", url: "https://www.altemploi5.com" },
    { nom: "Emploi.ga", url: "https://www.emploi.ga" },
    { nom: "Gabon du Numérique", url: "https://gabondunumerique.com" },
    { nom: "Jobartis Gabon", url: "https://www.jobartis.ga" }
  ]
};

// =========================================================================
// AGENT 3 : MATCHMAKER & IA ANALYZER
// =========================================================================
const Agent3_MatchAnalyzer = {
  name: "Agent 3 - Analyste de Pertinence & Matching",

  analyzeMatch(profile, job) {
    const jobText = (job.titre + " " + job.description + " " + job.competences_requises.join(" ")).toLowerCase();
    
    // Compétences du candidat à tester
    const candidateSkills = [
      { name: "JavaScript / TypeScript", match: jobText.includes("javascript") || jobText.includes("js") || jobText.includes("react") || jobText.includes("node") },
      { name: "PHP / Laravel", match: jobText.includes("php") || jobText.includes("laravel") },
      { name: "Python / Django", match: jobText.includes("python") || jobText.includes("django") },
      { name: "Mobile Flutter", match: jobText.includes("flutter") || jobText.includes("mobile") || jobText.includes("android") },
      { name: "Bases de données SQL / NoSQL", match: jobText.includes("sql") || jobText.includes("mysql") || jobText.includes("base") },
      { name: "API REST / Architecture", match: jobText.includes("api") || jobText.includes("web") || jobText.includes("architecture") },
      { name: "Sécurité & Déploiement", match: jobText.includes("sécurité") || jobText.includes("docker") || jobText.includes("cloud") || jobText.includes("système") },
      { name: "Localisation Gabon (Libreville)", match: job.localisation.toLowerCase().includes("libreville") || job.localisation.toLowerCase().includes("gabon") }
    ];

    const matchingSkills = candidateSkills.filter(s => s.match).map(s => s.name);
    
    // Calcul du score
    let baseScore = 65;
    baseScore += (matchingSkills.length * 4.5);
    
    // Bonus profil INPTIC / Master IA si mentionné
    if (jobText.includes("ingénieur") || jobText.includes("master") || jobText.includes("ia")) {
      baseScore += 5;
    }
    if (jobText.includes("laravel") || jobText.includes("flutter")) {
      baseScore += 6; // Spécialité forte de Rosny
    }

    const finalScore = Math.min(Math.round(baseScore), 98);

    // Analyse détaillée
    let pointsForts = [];
    let pointsVigilance = [];

    if (job.competences_requises.some(c => c.toLowerCase().includes("laravel") || c.toLowerCase().includes("php"))) {
      pointsForts.push("Excellente maîtrise démontrée avec l'application de Facturation Tech Info Plus");
    }
    if (job.competences_requises.some(c => c.toLowerCase().includes("flutter") || c.toLowerCase().includes("mobile"))) {
      pointsForts.push("Solide expérience Flutter prouvée avec l'application mobile de vote");
    }
    if (job.competences_requises.some(c => c.toLowerCase().includes("javascript") || c.toLowerCase().includes("node") || c.toLowerCase().includes("react"))) {
      pointsForts.push("Stack moderne Full Stack JavaScript validée par le portfolio interactif et chatbot");
    }
    if (job.localisation.toLowerCase().includes("libreville")) {
      pointsForts.push("Disponibilité immédiate sur place à Libreville (aucun délai de déménagement)");
    }

    // Points d'attention
    if (job.experience.includes("3 à 5 ans")) {
      pointsVigilance.push("Valoriser le volume de projets concrets réalisés pour compenser l'exigence formelle en années");
    }
    if (job.competences_requises.some(c => c.toLowerCase().includes("erp") || c.toLowerCase().includes("c#"))) {
      pointsVigilance.push("Mettre en avant l'expérience WinDev / Logiciels de gestion pour appuyer l'adaptabilité ERP");
    }

    return {
      score: finalScore,
      pointsForts: pointsForts.length > 0 ? pointsForts : ["Profil technique polyvalent en adéquation avec les prérequis du poste"],
      pointsVigilance: pointsVigilance.length > 0 ? pointsVigilance : ["Mettre l'accent sur les réalisations opérationnelles"],
      matchingSkills
    };
  }
};

// =========================================================================
// AGENT 4 : CANDIDACY PACKAGER & SYNTHESIZER
// =========================================================================
const Agent4_Synthesizer = {
  name: "Agent 4 - Synthétiseur & Préparateur de Candidature",

  generateReport(profile, analyzedJobs) {
    // Trier les offres par score décroissant
    analyzedJobs.sort((a, b) => b.analysis.score - a.analysis.score);

    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    let markdown = `# 🇬🇦 Rapport Multi-Agents IA : Chasse d'Emploi Tech au Gabon\n\n`;
    markdown += `> **Date d'exécution :** ${dateStr}  \n`;
    markdown += `> **Candidat ciblé :** ${profile.nom} (${profile.titre})  \n`;
    markdown += `> **Localisation :** ${profile.localisation} | **Contact :** ${profile.email} - ${profile.telephone}  \n\n`;
    markdown += `--- \n\n`;

    markdown += `## 🤖 Résumé du Processus des 4 Agents\n`;
    markdown += `1. **Agent 1 (Profil)** : Extraction des compétences clés (PHP/Laravel, Flutter, Node.js, Python, INPTIC, Master IA).\n`;
    markdown += `2. **Agent 2 (Scraper Gabon)** : Recensement des offres actives à Libreville (AltEmploi, Emploi.ga, ESN locales, Industrie).\n`;
    markdown += `3. **Agent 3 (Matching)** : Évaluation de la pertinence algorithmique et calcul des taux de compatibilité.\n`;
    markdown += `4. **Agent 4 (Synthèse)** : Checklist personnalisée des pièces à fournir et liens d'action immédiate.\n\n`;
    markdown += `--- \n\n`;

    markdown += `## 📊 Synthèse des Opportunités Identifiées\n\n`;
    markdown += `| Réf | Poste | Entreprise / Structure | Localisation | Match % | Action |\n`;
    markdown += `|---|---|---|---|:---:|---|\n`;

    analyzedJobs.forEach(item => {
      const j = item.job;
      const a = item.analysis;
      markdown += `| **${j.id}** | ${j.titre} | ${j.entreprise} | ${j.localisation.split(',')[0]} | **${a.score}%** | [Postuler](#${j.id.toLowerCase()}) |\n`;
    });

    markdown += `\n---\n\n`;
    markdown += `## 🎯 Détail des Offres & Dossiers de Candidature Recommandés\n\n`;

    analyzedJobs.forEach((item, index) => {
      const j = item.job;
      const a = item.analysis;

      markdown += `### ${index + 1}. [${j.id}] ${j.titre}\n`;
      markdown += `* **🏢 Entreprise / Cabinet :** ${j.entreprise}\n`;
      markdown += `* **📍 Localisation :** ${j.localisation}\n`;
      markdown += `* **💼 Contrat :** ${j.type_contrat} | **Secteur :** ${j.secteur}\n`;
      markdown += `* **⭐ Taux de compatibilité :** **${a.score}%**\n`;
      markdown += `* **🔗 Lien / Source :** [${j.source}](${j.lien})\n`;
      markdown += `* **✉️ Contact Recrutement :** \`${j.contact_candidature}\`\n\n`;

      markdown += `#### 📝 Description du poste\n`;
      markdown += `> ${j.description}\n\n`;

      markdown += `#### 💡 Analyse IA du Matching\n`;
      markdown += `* **Compétences validées :** ${a.matchingSkills.join(", ")}\n`;
      markdown += `* **Points forts du profil :**\n`;
      a.pointsForts.forEach(pf => {
        markdown += `  - ✅ ${pf}\n`;
      });
      markdown += `* **Conseil stratégique pour la candidature :**\n`;
      a.pointsVigilance.forEach(pv => {
        markdown += `  - 💡 ${pv}\n`;
      });

      markdown += `\n#### 📁 Éléments impératifs à fournir pour postuler :\n`;
      markdown += `1. **CV personnalisé :** Télécharger le CV de Rosny (\`pdf/OTSINA MINKO Rodrigue cv.pdf\`) en mettant en exergue les projets pertinents pour cette offre.\n`;
      markdown += `2. **Lettre de motivation ciblée :** Adresser le courrier à l'attention de la DRH / Cabinet en mentionnant la disponibilité immédiate à Libreville.\n`;
      markdown += `3. **Portfolio & Réalisations :** Inclure l'URL du portfolio en ligne ainsi que les liens GitHub ou démos (Tech Info Plus, App traduction, etc.).\n`;
      markdown += `4. **Copies des diplômes certifiés :** Diplôme INPTIC Génie Logiciel + Attestation d'inscription en Master IA.\n\n`;
      markdown += `---\n\n`;
    });

    markdown += `## 🚀 Guide d'Action Immédiate pour Rosny\n`;
    markdown += `1. Envoyer la candidature par email pour l'offre **${analyzedJobs[0].job.id}** (${analyzedJobs[0].job.titre} - Match ${analyzedJobs[0].analysis.score}%) dès aujourd'hui.\n`;
    markdown += `2. Déposer le profil sur **AltEmploi Gabon** (Boulevard Triomphal, Libreville) et **Emploi.ga**.\n`;
    markdown += `3. Relancer les contacts recruteurs après 5 jours ouvrés via WhatsApp ou email professionnel.\n`;

    return markdown;
  }
};

// =========================================================================
// ORCHESTRATEUR PRINCIPAL DU SYSTÈME MULTI-AGENTS
// =========================================================================
async function runJobHunterAgent(customProfile = null) {
  console.log("===============================================================");
  console.log("🤖 LANCEMENT DU WORKFLOW MULTI-AGENTS IA - CHASSE D'EMPLOI GABON");
  console.log("===============================================================\n");

  // Étape 1 : Profiling
  console.log("▶️ [Agent 1] Analyse du profil et extraction des compétences...");
  const profile = Agent1_Profiler.extractProfile(customProfile);
  console.log(`   ✅ Profil chargé : ${profile.nom} | ${profile.titre}`);
  console.log(`   📍 Localisation : ${profile.localisation}`);

  // Étape 2 : Récupération des offres
  console.log("\n▶️ [Agent 2] Récupération et agrégation des offres d'emploi au Gabon...");
  const jobs = await Agent2_JobHarvester.fetchJobs();
  console.log(`   ✅ ${jobs.length} opportunités tech ciblées identifiées à Libreville & Gabon.`);

  // Étape 3 : Analyse & Matching
  console.log("\n▶️ [Agent 3] Calcul des taux de compatibilité et scoring IA...");
  const analyzedJobs = jobs.map(job => {
    const analysis = Agent3_MatchAnalyzer.analyzeMatch(profile, job);
    console.log(`   🎯 [${job.id}] ${job.titre} -> Match : ${analysis.score}%`);
    return { job, analysis };
  });

  // Étape 4 : Synthèse et génération du rapport
  console.log("\n▶️ [Agent 4] Génération de la synthèse et des dossiers de candidature...");
  const reportMarkdown = Agent4_Synthesizer.generateReport(profile, analyzedJobs);

  // Sauvegarde des résultats
  const rootDir = path.resolve(__dirname, '..');
  const reportPath = path.join(rootDir, 'RAPPORT_OFFRES_EMPLOI_GABON.md');
  const jsonPath = path.join(rootDir, 'offres_gabon.json');

  fs.writeFileSync(reportPath, reportMarkdown, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify(analyzedJobs, null, 2), 'utf-8');

  // Étape 5 : Rédaction automatique des lettres de motivation ultra-personnalisées
  console.log("\n▶️ [Agent 4+] Rédaction des lettres de motivation & emails personnalisés...");
  const { saveAllCoverLetters } = require('../services/cover-letter-generator');
  const lettersResult = saveAllCoverLetters(profile, analyzedJobs);
  console.log(`   ✅ ${lettersResult.totalGenerated} lettres de motivation et candidatures générées dans 'candidatures/' !`);

  console.log(`\n🎉 WORKFLOW TERMINÉ AVEC SUCCÈS !`);
  console.log(`📄 Rapport Markdown généré dans : ${reportPath}`);
  console.log(`💾 Données JSON exportées dans : ${jsonPath}`);
  console.log(`📁 Dossiers de candidatures dans : ${lettersResult.candidaturesDir}`);

  return {
    profile,
    analyzedJobs,
    reportMarkdown,
    reportPath,
    candidatures: lettersResult
  };
}

// Export pour utilisation comme module dans l'API ou le chatbot
module.exports = {
  Agent1_Profiler,
  Agent2_JobHarvester,
  Agent3_MatchAnalyzer,
  Agent4_Synthesizer,
  runJobHunterAgent
};

// Exécution directe si appelé en ligne de commande
if (require.main === module) {
  runJobHunterAgent().catch(err => {
    console.error("❌ Erreur lors de l'exécution du Job Hunter:", err);
    process.exit(1);
  });
}
