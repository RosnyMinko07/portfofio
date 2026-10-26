// services/cover-letter-generator.js
// Générateur automatique de lettres de motivation et emails de candidature
// Basé sur le profil réel de Rosny OTSINA et ultra-personnalisé pour chaque offre d'emploi au Gabon

const fs = require('fs');
const path = require('path');

/**
 * Génère le contenu d'une lettre de motivation ciblée
 */
function generateCoverLetter(profile, job) {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const skillsText = job.competences_requises.join(', ');
  const hasFlutter = skillsText.toLowerCase().includes('flutter') || skillsText.toLowerCase().includes('mobile');
  const hasLaravel = skillsText.toLowerCase().includes('laravel') || skillsText.toLowerCase().includes('php');
  const hasJsReact = skillsText.toLowerCase().includes('react') || skillsText.toLowerCase().includes('node') || skillsText.toLowerCase().includes('javascript');
  const hasPython = skillsText.toLowerCase().includes('python') || skillsText.toLowerCase().includes('django');

  // Sélection dynamique des projets les plus pertinents pour cette offre
  let relevantProjectsText = "";
  if (hasLaravel && hasFlutter) {
    relevantProjectsText = "À titre d'illustration, j'ai notamment conçu et déployé l'application de facturation et de gestion de stocks « Tech Info Plus » (Laravel & MySQL) ainsi qu'une solution mobile de vote électronique sécurisée en temps réel sous Flutter et Firebase.";
  } else if (hasFlutter) {
    relevantProjectsText = "J'ai développé plusieurs applications sous Flutter dont une application mobile de vote électronique en temps réel, garantissant des interfaces fluides, une excellente ergonomie mobile et une gestion robuste des états et des API.";
  } else if (hasLaravel || skillsText.toLowerCase().includes('php')) {
    relevantProjectsText = "Dans le cadre de missions concrètes, j'ai développé l'ERP de facturation « Tech Info Plus » (Laravel, MySQL, Bootstrap) pour une PME, couvrant l'intégralité du cycle de vente, la gestion des stocks, la génération de devis/factures et les tableaux de bord décisionnels.";
  } else if (hasJsReact) {
    relevantProjectsText = "Mon expertise couvre l'écosystème Full Stack moderne (React.js, Node.js, Express, TypeScript), comme en témoigne mon portfolio interactif intégrant des agents d'intelligence artificielle et une architecture d'API modulaire.";
  } else {
    relevantProjectsText = "Mes réalisations incluent des applications web métiers de gestion (PHP/Laravel, MySQL), des solutions mobiles Flutter, ainsi que des plateformes e-commerce complètes avec dashboards d'administration.";
  }

  // Focus technique ciblé
  let techFitText = "";
  if (job.description.toLowerCase().includes('api') || job.description.toLowerCase().includes('architecture')) {
    techFitText = "La conception d'architectures logicielles pérennes, le développement d'API REST sécurisées et l'optimisation des bases de données sont au cœur de ma pratique quotidienne.";
  } else {
    techFitText = "Mon approche du développement logiciel privilégie la clarté du code, la sécurité des données, l'expérience utilisateur et le respect des bonnes pratiques de développement.";
  }

  const letterContent = {
    expediteur: {
      nom: profile.nom,
      titre: profile.titre,
      adresse: profile.localisation,
      telephone: profile.telephone,
      email: profile.email
    },
    destinataire: {
      entreprise: job.entreprise,
      service: "Direction des Ressources Humaines / Pôle Recrutement IT",
      lieu: job.localisation
    },
    lieuDate: `Libreville, le ${dateStr}`,
    objet: `Candidature au poste de ${job.titre} (Réf. : ${job.id})`,
    formuleAppel: "Madame, Monsieur,",
    
    paragrapheIntro: `C'est avec un vif intérêt que j'ai pris connaissance de votre offre d'emploi concernant le poste de **${job.titre}** au sein de **${job.entreprise}**. Titulaire d'une Licence professionnelle en Génie Logiciel de l'INPTIC Libreville et actuellement étudiant en Master Intelligence Artificielle, mon profil polyvalent en développement Full Stack correspond étroitement aux prérequis techniques et humains de votre structure.`,
    
    paragrapheTechnique: `Au cours de mon cursus académique et de mes diverses réalisations en développement logiciel, j'ai développé une solide maîtrise des technologies requises pour ce poste, notamment en **${job.competences_requises.slice(0, 4).join(', ')}**. ${techFitText}`,
    
    paragrapheProjets: relevantProjectsText,
    
    paragrapheMotivation: `Intégrer votre équipe représente pour moi l'opportunité d'apporter ma rigueur technique, ma réactivité et mon esprit d'innovation au service de vos projets numériques à Libreville. Résidant sur place et immédiatement disponible, je suis prêt à m'investir pleinement pour concevoir et maintenir des solutions à forte valeur ajoutée.`,
    
    paragrapheCloture: `Je serais ravi de vous rencontrer lors d'un entretien afin de vous exposer plus en détail mes motivations et vous présenter mes démonstrations de projets.`,
    
    formulePolitesse: `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
    
    signature: profile.nom
  };

  return letterContent;
}

/**
 * Génère le Markdown complet de la lettre
 */
function formatLetterToMarkdown(letterData) {
  const e = letterData.expediteur;
  const d = letterData.destinataire;

  return `
# ${e.nom}
**${e.titre}**  
📍 ${e.adresse} | 📞 ${e.telephone} | ✉️ ${e.email}  

---

**À l'attention de :**  
${d.service}  
**${d.entreprise}**  
📍 ${d.lieu}  

**${letterData.lieuDate}**  

---

### **Objet : ${letterData.objet}**

${letterData.formuleAppel}

${letterData.paragrapheIntro}

${letterData.paragrapheTechnique}

${letterData.paragrapheProjets}

${letterData.paragrapheMotivation}

${letterData.paragrapheCloture}

${letterData.formulePolitesse}

---
**${letterData.signature}**  
*Pièces jointes : Curriculum Vitae (Licence Génie Logiciel INPTIC), Références de projets & Liens démos*
`.trim();
}

/**
 * Génère une version HTML élégante et prête à être imprimée en PDF
 */
function formatLetterToPrintableHtml(letterData, job) {
  const e = letterData.expediteur;
  const d = letterData.destinataire;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lettre de Motivation - ${e.nom} - ${job.titre}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #2c3e50;
      background-color: #f7f9fa;
      margin: 0;
      padding: 20px;
    }
    .letter-page {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 50px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      border-bottom: 2px solid #ec5c2a;
      padding-bottom: 20px;
    }
    .sender h1 {
      margin: 0 0 5px 0;
      font-size: 20px;
      color: #1f2235;
    }
    .sender p {
      margin: 2px 0;
      font-size: 13px;
      color: #666;
    }
    .recipient {
      text-align: right;
      font-size: 13px;
    }
    .recipient strong {
      color: #1f2235;
      font-size: 15px;
    }
    .date-line {
      text-align: right;
      font-size: 13px;
      color: #777;
      margin-bottom: 25px;
      font-style: italic;
    }
    .subject-box {
      background: #fdf5f2;
      border-left: 4px solid #ec5c2a;
      padding: 10px 16px;
      margin-bottom: 25px;
      font-weight: bold;
      color: #1f2235;
      font-size: 14.5px;
    }
    .letter-body p {
      margin-bottom: 16px;
      text-align: justify;
      font-size: 14px;
      color: #333333;
    }
    .signature-area {
      margin-top: 35px;
      text-align: right;
    }
    .signature-area strong {
      font-size: 15px;
      color: #1f2235;
    }
    .attachments {
      margin-top: 40px;
      border-top: 1px solid #e1e8ed;
      padding-top: 12px;
      font-size: 12px;
      color: #777;
    }
    .print-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ec5c2a;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 30px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(236,92,42,0.4);
      transition: all 0.2s;
    }
    .print-btn:hover {
      background: #d84b1a;
      transform: translateY(-2px);
    }
    @media print {
      body { background: transparent; padding: 0; }
      .letter-page { box-shadow: none; padding: 0; max-width: 100%; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="letter-page">
    <div class="header">
      <div class="sender">
        <h1>${e.nom}</h1>
        <p><strong>${e.titre}</strong></p>
        <p>📍 ${e.adresse}</p>
        <p>📞 ${e.telephone}</p>
        <p>✉️ ${e.email}</p>
      </div>
      <div class="recipient">
        <p><strong>${d.entreprise}</strong></p>
        <p>${d.service}</p>
        <p>📍 ${d.lieu}</p>
      </div>
    </div>

    <div class="date-line">${letterData.lieuDate}</div>

    <div class="subject-box">
      ${letterData.objet}
    </div>

    <div class="letter-body">
      <p>${letterData.formuleAppel}</p>
      <p>${letterData.paragrapheIntro}</p>
      <p>${letterData.paragrapheTechnique}</p>
      <p>${letterData.paragrapheProjets}</p>
      <p>${letterData.paragrapheMotivation}</p>
      <p>${letterData.paragrapheCloture}</p>
      <p>${letterData.formulePolitesse}</p>
    </div>

    <div class="signature-area">
      <p><strong>${letterData.signature}</strong></p>
      <p style="font-size: 12px; color: #888;">Développeur Full Stack & Mobile</p>
    </div>

    <div class="attachments">
      <strong>P.J. :</strong> Curriculum Vitae (Format PDF), Portfolio en ligne, Liens GitHub & Projets
    </div>
  </div>

  <button class="print-btn" onclick="window.print()">🖨️ Imprimer en PDF</button>
</body>
</html>`;
}

/**
 * Extrait l'adresse email de contact du recruteur
 */
function extractEmailFromContact(contactText) {
  if (!contactText) return 'contact@gabon-recrutement.ga';
  const match = contactText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  return match ? match[1] : 'contact@gabon-recrutement.ga';
}

/**
 * Génère le lien direct pour ouvrir Gmail avec destinataire, objet et message pré-remplis
 */
function generateGmailComposeUrl({ to, subject, body }) {
  const base = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = new URLSearchParams({
    to: to || '',
    su: subject || '',
    body: body || ''
  });
  return `${base}&${params.toString()}`;
}

/**
 * Génère les détails complets de candidature email (sujet, corps, lien direct Gmail)
 */
function getApplicationEmailDetails(profile, job) {
  const recipientEmail = extractEmailFromContact(job.contact_candidature);
  const subject = `Candidature au poste de ${job.titre} - ${profile.nom} (Réf. ${job.id})`;
  const body = `Bonjour Madame, Monsieur,\n\n` +
    `Titulaire d'une Licence professionnelle en Génie Logiciel de l'INPTIC et actuellement en Master Intelligence Artificielle à Libreville, je vous adresse ma candidature pour le poste de ${job.titre} au sein de votre structure (${job.entreprise}).\n\n` +
    `Spécialisé dans le développement Full Stack (${job.competences_requises.slice(0, 4).join(', ')}), j'ai mené à bien plusieurs projets applicatifs d'envergure, notamment un système ERP de facturation pour PME (Laravel, MySQL) et des applications mobiles temps réel sous Flutter.\n\n` +
    `Vous trouverez ci-joint mon Curriculum Vitae ainsi que ma lettre de motivation détaillée. Mon portfolio et mes démonstrations de code sont accessibles sur : https://rosny-portfolio.vercel.app/\n\n` +
    `Résidant à Libreville et disponible immédiatement, je me tiens à votre entière disposition pour un entretien.\n\n` +
    `Cordialement,\n\n` +
    `${profile.nom}\n` +
    `Développeur Web & Mobile Freelance\n` +
    `📞 ${profile.telephone}\n` +
    `✉️ ${profile.email}\n` +
    `📍 ${profile.localisation}\n`;

  const gmailUrl = generateGmailComposeUrl({ to: recipientEmail, subject, body });
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    to: recipientEmail,
    subject,
    body,
    gmailUrl,
    mailtoUrl
  };
}

/**
 * Génère le texte d'accompagnement email (court, courtois, prêt à envoyer)
 */
function generateEmailApplicationText(profile, job) {
  const details = getApplicationEmailDetails(profile, job);
  return `Destinataire : ${details.to}\n` +
    `Objet : ${details.subject}\n\n` +
    `🔗 LIEN DIRECT POUR OUVRIR GMAIL PRÉ-REMPLI EN 1 CLIC :\n` +
    `${details.gmailUrl}\n\n` +
    `-----------------------------------------------------------------\n` +
    `TEXTE DU MESSAGE :\n` +
    `-----------------------------------------------------------------\n` +
    `${details.body}`;
}

/**
 * Crée tous les dossiers et fichiers de candidatures
 */
function saveAllCoverLetters(profile, analyzedJobs) {
  const rootDir = path.resolve(__dirname, '..');
  const candidaturesDir = path.join(rootDir, 'candidatures');

  if (!fs.existsSync(candidaturesDir)) {
    fs.mkdirSync(candidaturesDir, { recursive: true });
  }

  const generatedFiles = [];

  analyzedJobs.forEach(item => {
    const job = item.job;
    const letterData = generateCoverLetter(profile, job);
    const emailDetails = getApplicationEmailDetails(profile, job);
    
    // 1. Markdown
    const markdownContent = formatLetterToMarkdown(letterData);
    const mdFileName = `${job.id}_lettre_motivation.md`;
    const mdFilePath = path.join(candidaturesDir, mdFileName);
    fs.writeFileSync(mdFilePath, markdownContent, 'utf-8');

    // 2. HTML Imprimable PDF avec bouton 1-clic Gmail
    const htmlContent = formatLetterToPrintableHtml(letterData, job).replace(
      '</body>',
      `<div class="quick-nav-bar" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2235;padding:10px 20px;border-radius:30px;box-shadow:0 6px 20px rgba(0,0,0,0.25);display:flex;gap:12px;z-index:9999;">
        <a href="${emailDetails.gmailUrl}" target="_blank" style="background:#27ae60;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:20px;font-weight:bold;font-size:13px;display:flex;align-items:center;gap:6px;">
          ✉️ Ouvrir dans Gmail (Tout pré-rempli)
        </a>
        <button onclick="window.print()" style="background:#ec5c2a;color:#ffffff;border:none;padding:10px 18px;border-radius:20px;font-weight:bold;font-size:13px;cursor:pointer;">
          🖨️ Imprimer en PDF
        </button>
      </div>
      <style>@media print{.quick-nav-bar{display:none!important;}}</style>
      </body>`
    );
    const htmlFileName = `${job.id}_lettre_motivation.html`;
    const htmlFilePath = path.join(candidaturesDir, htmlFileName);
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

    // 3. Email d'accompagnement
    const emailDraft = generateEmailApplicationText(profile, job);
    const emailFileName = `${job.id}_email_candidature.txt`;
    const emailFilePath = path.join(candidaturesDir, emailFileName);
    fs.writeFileSync(emailFilePath, emailDraft, 'utf-8');

    generatedFiles.push({
      jobId: job.id,
      jobTitre: job.titre,
      entreprise: job.entreprise,
      score: item.analysis.score,
      recipientEmail: emailDetails.to,
      gmailUrl: emailDetails.gmailUrl,
      mdFile: mdFileName,
      htmlFile: htmlFileName,
      emailFile: emailFileName
    });
  });

  // Création du fichier index
  let indexMd = `# 📁 Dossiers de Candidatures Automatisés — Rosny OTSINA\n\n`;
  indexMd += `> **Dernière génération :** ${new Date().toLocaleString('fr-FR')}  \n`;
  indexMd += `> **Candidat :** ${profile.nom} (${profile.email} - ${profile.telephone})  \n\n`;
  indexMd += `Ce dossier regroupe toutes les lettres de motivation personnalisées et les liens pour postuler en 1 clic dans Gmail.\n\n`;
  indexMd += `--- \n\n`;
  indexMd += `## 🚀 Candidatures Prêtes à Partir (Postuler en 1 Clic)\n\n`;
  indexMd += `| Réf | Poste | Entreprise | Match | ✉️ 1 Clic Gmail | 📄 Lettre Imprimer PDF |\n`;
  indexMd += `|---|---|---|:---:|---|---|\n`;

  generatedFiles.forEach(f => {
    indexMd += `| **${f.jobId}** | ${f.jobTitre} | ${f.entreprise} | **${f.score}%** | [**👉 Ouvrir dans Gmail**](${f.gmailUrl}) | [🖨️ Ouvrir HTML](./${f.htmlFile}) |\n`;
  });

  indexMd += `\n---\n\n`;
  indexMd += `### 💡 Comment postuler en 30 secondes :\n`;
  indexMd += `1. **Clique sur [👉 Ouvrir dans Gmail]** dans le tableau ci-dessus.\n`;
  indexMd += `2. Ton Gmail s'ouvre avec **le destinataire, l'objet et le texte de motivation déjà écrits**.\n`;
  indexMd += `3. Joins ton CV (\`pdf/OTSINA MINKO Rodrigue cv.pdf\`) et clique sur **Envoyer** !\n`;

  const indexPath = path.join(candidaturesDir, 'INDEX_CANDIDATURES.md');
  fs.writeFileSync(indexPath, indexMd, 'utf-8');

  return {
    candidaturesDir,
    totalGenerated: generatedFiles.length,
    generatedFiles,
    indexPath
  };
}

module.exports = {
  generateCoverLetter,
  formatLetterToMarkdown,
  formatLetterToPrintableHtml,
  generateEmailApplicationText,
  getApplicationEmailDetails,
  generateGmailComposeUrl,
  extractEmailFromContact,
  saveAllCoverLetters
};

