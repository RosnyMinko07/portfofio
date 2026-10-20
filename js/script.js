/* ==================== TRADUCTIONS COMPLÈTES (FR / EN) ==================== */
const translations = {
    fr: {
        // Navigation
        nav_home: "Menu",
        nav_about: "A propos",
        nav_services: "Services",
        nav_process: "Processus",
        nav_skills: "Compétences",
        nav_portfolio: "Portfolio",
        nav_certifications: "Certifications",
        nav_contact: "Contact",

        // Hero
        home_hello: "Salut, moi c'est",
        home_iam: "Je suis",
        home_desc: "Développeur Web et Mobile freelance, je crée des applications robustes, évolutives et maintenables, du backend au frontend, en passant par le design et le déploiement. Mon portfolio présente mes projets, alliant techniques modernes, créativité et solutions concrètes, pour démontrer ma capacité à mener un projet de A à Z.",
        home_hire_me: "Engagez moi",
        stats_projects: "Projets réalisés",
        stats_years: "Ans d'expérience",
        stats_tech: "Technologies",
        typed_strings: ["", "", "Developpeur Full-Stack", "Developpeur mobile", "Freelance"],

        // About
        about_title: "A Propos de Moi",
        about_subtitle: "Je suis Rosny, <span>Développeur Web et Mobile Freelance</span>",
        about_desc: "Je crée des applications web et mobiles <strong>fiables et évolutives</strong>, alliant <strong>technique, design et performance</strong>. Mon objectif : transformer vos besoins en solutions fonctionnelles et maintenables, du concept jusqu’au déploiement.",
        about_nationality: "Nationalité : ",
        about_nationality_val: "Gabonaise",
        about_exp_label: "Expérience : ",
        about_exp_val: "3+ ans",
        about_phone: "Phone : ",
        about_city: "Ville : ",
        about_city_val: "Libreville / Owendo, Gabon",
        about_freelance_val: "Disponible",
        about_cv_btn: "Voir mon CV",

        // Expériences (Timeline)
        about_exp_title: "Expériences Professionnelles",
        exp_date_1: "Jan. 2026 - Présent · Libreville",
        exp_title_1: "Développeur Full-Stack Freelance — HÔTEL YA",
        exp_text_1: "Conception d'une solution complète de gestion hôtelière : application mobile (Flutter), site web (React / Next.js) et logiciel desktop — réservations en ligne, facturation, suivi clients, gestion de stock, tableau de bord admin. Architecture API REST, base de données MySQL / PostgreSQL, authentification et déploiement.",

        exp_date_2: "Avril 2026 - Présent · Libreville",
        exp_title_2: "Développeur Backend Freelance — AARTFLIX",
        exp_text_2: "Développement du backend, gestion de la base de données et administration de la plateforme de streaming.",

        exp_date_3: "Août - Oct. 2025 · Port-Gentil",
        exp_title_3: "Développeur Full-Stack — TECH INFO PLUS",
        exp_text_3: "Conception et développement d'un système de facturation et de gestion de stock, de la modélisation des données à l'interface utilisateur. Optimisation des performances, diagnostic et correction d'anomalies (débogage, maintenance corrective).",

        exp_date_4: "Juil. - Sept. 2024 · Libreville",
        exp_title_4: "Développeur Full-Stack — INPTIC",
        exp_text_4: "Développement d'une application multiplateforme de suivi et de gestion des notes (PHP, MySQL, Bootstrap) : conception de la base de données, authentification, gestion des notes, calcul automatique des moyennes.",

        exp_date_5: "Jan. - Juin 2024 · Libreville",
        exp_title_5: "Développeur Mobile & Web Freelance",
        exp_text_5: "Applications web et mobiles sur mesure pour des clients locaux (gestion commerciale, suivi de commandes, interfaces admin) : analyse des besoins, prototypage, développement et livraison.",

        exp_date_6: "Mars - Déc. 2023 · Libreville",
        exp_title_6: "Développeur Mobile Freelance — SUIVI DE LIVRAISONS",
        exp_text_6: "Application mobile Android OS (Flutter) pour le suivi de livraisons et la gestion de commandes d'un commerce local : création de commande, attribution livreur, suivi GPS temps réel, confirmation, historique et facturation. Backend API REST (Node.js / PHP), MySQL, notifications push.",

        // Services
        services_title: "Services",
        srv_title_1: "Développement Mobile",
        srv_desc_1: "Création d'applications Android et iOS performantes et intuitives, adaptées à vos besoins.",
        srv_title_2: "Développement Web",
        srv_desc_2: "Conception de sites web et logiciels robustes, modernes et évolutifs pour tous types de projets.",
        srv_title_3: "Gestion de Bases de Données",
        srv_desc_3: "Mise en place, organisation et sécurisation de vos données pour un accès fiable et protégé.",
        srv_title_4: "Sécurité Informatique",
        srv_desc_4: "Protection de vos systèmes et données sensibles contre les accès non autorisés et les menaces externes.",
        srv_title_5: "Maintenance Informatique",
        srv_desc_5: "Assurance du bon fonctionnement de vos ordinateurs et serveurs, avec un suivi fiable et réactif.",
        srv_title_6: "Administration Réseau",
        srv_desc_6: "Configuration, surveillance et gestion des infrastructures réseau pour garantir disponibilité et sécurité des communications.",
        srv_title_7: "Administration DBA",
        srv_desc_7: "Gestion, optimisation et maintenance de vos bases de données pour garantir performance, intégrité et disponibilité des données.",
        srv_title_8: "Conception de Maquettes",
        srv_desc_8: "Création de maquettes et prototypes UI/UX modernes et intuitifs avant le développement, pour valider l'expérience utilisateur.",
        srv_title_9: "Solutions Intelligence Artificielle",
        srv_desc_9: "Intégration de solutions IA dans vos applications : chatbots, recommandations, analyse de données et automatisation intelligente.",
        srv_title_10: "Déploiement & Cloud",
        srv_desc_10: "Déploiement de vos applications sur des plateformes cloud (Vercel, AWS, VPS) avec configuration CI/CD et gestion des environnements.",

        // Processus de Travail
        process_title: "Mon Processus de Travail",
        process_lead: "Une méthodologie éprouvée en 5 étapes pour transformer vos idées en solutions numériques fiables, performantes et évolutives.",
        process_step_1_title: "Cadrage & Analyse",
        process_step_1_desc: "Compréhension approfondie de vos objectifs, analyse des besoins utilisateurs, étude de faisabilité et cahier des charges détaillé.",
        process_step_1_b1: "Recueil des besoins & objectifs",
        process_step_1_b2: "Choix de la stack technique",
        process_step_1_b3: "Estimation & roadmap projet",
        process_step_2_title: "Design & Architecture",
        process_step_2_desc: "Conception de l'architecture logicielle, modélisation des données et prototypage d'interfaces UI/UX intuitives et modernes.",
        process_step_2_b1: "Wireframes & maquettes interactives",
        process_step_2_b2: "Architecture base de données & API",
        process_step_2_b3: "Validation du parcours utilisateur",
        process_step_3_title: "Développement & Tests",
        process_step_3_desc: "Développement itératif avec du code propre, modulaire et performant, accompagné de tests continus et démonstrations régulières.",
        process_step_3_b1: "Code robuste & sécurisé",
        process_step_3_b2: "Tests unitaires & d'intégration",
        process_step_3_b3: "Démos & retours itératifs",
        process_step_4_title: "Déploiement & Livraison",
        process_step_4_desc: "Mise en production sécurisée sur le cloud, optimisation SEO, configuration des domaines, SSL et remise d'une documentation complète.",
        process_step_4_b1: "Déploiement Cloud & CI/CD",
        process_step_4_b2: "Optimisation SEO & vitesse",
        process_step_4_b3: "Documentation & passation claire",
        process_step_5_title: "Suivi & Maintenance",
        process_step_5_desc: "Accompagnement après le lancement, monitoring des performances, sauvegardes automatisées et évolutions selon vos besoins.",
        process_step_5_b1: "Maintenance préventive & corrective",
        process_step_5_b2: "Surveillance & sauvegardes",
        process_step_5_b3: "Évolution & nouvelles fonctionnalités",
        process_cta_title: "Un projet en tête ou une idée à concrétiser ?",
        process_cta_desc: "Bénéficiez d'une méthode claire et éprouvée pour transformer votre vision en réalité avec un accompagnement sur mesure.",
        process_cta_btn: "Lancer mon projet <i class=\"fas fa-arrow-right\"></i>",

        // Compétences
        skills_title: "Compétences",
        skill_p1_title: "Développement Web & Backend",
        skill_p1_desc: "Applications web modernes, architectures MVC et API REST performantes.",
        skill_p2_title: "Mobile & Multiplateforme",
        skill_p2_desc: "Applications multiplateformes réactives pour Android, iOS et logiciels de bureau.",
        skill_p3_title: "Données & Intelligence Artificielle",
        skill_p3_desc: "Gestion de bases de données relationnelles / NoSQL et intégration de modèles d'IA.",
        skill_p4_title: "Conception & DevOps",
        skill_p4_desc: "Modélisation préalable des besoins, gestion de versions et conteneurisation.",

        // Portfolio (Projets)
        portfolio_title: "Mes Projets",
        filter_all: "Tous",
        filter_web: "Web",
        filter_mobile: "Mobile",
        filter_desktop: "Desktop",

        proj_title_1: "Tradition-IA — Application de traduction des langues gabonaises",
        proj_desc_1: "Application web responsive permettant la traduction entre différentes langues locales du Gabon avec interface intuitive et base de données linguistique.",
        proj_title_2: "Application Web de Facturation — Tech Info Plus",
        proj_desc_2: "Système complet de facturation et de suivi de stock pour une PME à Port-Gentil. Gestion clients, fournisseurs, articles, devis, règlements et rapports.",
        proj_title_3: "Application GABON — Lieux populaires",
        proj_desc_3: "Application répertoriant les endroits populaires de tout le Gabon avec système de connexion, inscription et navigation par région.",
        proj_title_4: "Application Web Mini Market (Projet Scolaire)",
        proj_desc_4: "Plateforme e-commerce pour la gestion d'un mini market en ligne avec espace vendeur, panier, paiement et tableau de bord administrateur.",
        proj_title_5: "Application Mobile de Vote",
        proj_desc_5: "Application mobile pour la réalisation de votes électroniques en temps réel avec interface administrateur et saisie des résultats.",
        proj_title_6: "AARTFLIX — Plateforme de Streaming",
        proj_desc_6: "Plateforme de streaming vidéo avec catalogue multimédia interactif, lecteur fluide et administration optimisée du backend et de la base de données.",
        proj_title_7: "HÔTEL YA — Système de Gestion Hôtelière",
        proj_desc_7: "Solution complète de gestion hôtelière multiplateforme : réservations en ligne, facturation automatisée, gestion des stocks, suivi clients et tableau de bord administrateur.",

        btn_hide_images: "Masquer les images",
        btn_show_images: "Voir les images",
        btn_demo: "Voir la démo",

        // Modals
        cv_modal_title: "CV — Rosny OTSINA",
        cv_modal_dl: "Télécharger le CV",
        cv_fallback_text: "Aperçu non disponible sur ce navigateur.",
        cert_modal_title: "Certificat",

        // Certifications
        cert_title: "Certifications",
        cert_desc: "Mes certifications et formations obtenues.",
        cert_zoom: "Agrandir",
        cert_badge_ml: "Machine Learning",
        cert_badge_prog: "Programmation",
        cert_badge_db: "Bases de données",

        // Contact
        contact_title: "Contactez - Moi",
        contact_q: "Avez Vous Des Questions ?",
        contact_sub: "JE SUIS A VOTRE SERVICE",
        contact_call: "Contactez moi au",
        contact_loc: "Localité",
        contact_form_title: "ENVOYEZ MOI UN MESSAGE",
        contact_form_sub: "JE SUIS DISPONIBLE H24/24",
        contact_ph_name: "Nom complet",
        contact_ph_email: "Adresse E-mail",
        contact_ph_subj: "Objet",
        contact_ph_msg: "Message",
        contact_send_btn: "Envoyer",
        contact_sending: "Envoi en cours...",
        contact_success: "Message envoyé avec succès !",
        contact_error: "Erreur lors de l'envoi du message.",

        // Footer & Divers
        footer_role: "Développeur Web & Mobile Freelance",
        switcher_title: "Theme couleurs",

        // Chatbot
        chat_status: "En ligne &bull; Voix féminine",
        chat_welcome: "Bonjour ! Je suis Sophia, l'assistante IA de Rosny OTSINA. Je peux vous parler de ses projets, compétences et services. Comment puis-je vous aider ?",
        chat_play_title: "Lire ce message",
        chat_now: "À l'instant",
        chat_input_ph: "Posez votre question à Sophia..."
    },

    en: {
        // Navigation
        nav_home: "Home",
        nav_about: "About",
        nav_services: "Services",
        nav_process: "Process",
        nav_skills: "Skills",
        nav_portfolio: "Portfolio",
        nav_certifications: "Certifications",
        nav_contact: "Contact",

        // Hero
        home_hello: "Hello, I am",
        home_iam: "I am a",
        home_desc: "Freelance Web & Mobile Developer, I design and build robust, scalable, and maintainable applications from backend to frontend, design to deployment. My portfolio showcases my projects, combining modern technologies, creativity, and concrete solutions to turn ideas into reality.",
        home_hire_me: "Hire Me",
        stats_projects: "Projects Completed",
        stats_years: "Years Experience",
        stats_tech: "Technologies",
        typed_strings: ["", "", "Full-Stack Developer", "Mobile Developer", "Freelancer"],

        // About
        about_title: "About Me",
        about_subtitle: "I am Rosny, <span>Freelance Web & Mobile Developer</span>",
        about_desc: "I build reliable and scalable web and mobile applications, blending <strong>engineering, design, and performance</strong>. My objective: turn your vision into reliable, maintainable solutions from initial concept to deployment.",
        about_nationality: "Nationality: ",
        about_nationality_val: "Gabonese",
        about_exp_label: "Experience: ",
        about_exp_val: "3+ years",
        about_phone: "Phone: ",
        about_city: "City: ",
        about_city_val: "Libreville / Owendo, Gabon",
        about_freelance_val: "Available",
        about_cv_btn: "View My CV",

        // Expériences (Timeline)
        about_exp_title: "Professional Experience",
        exp_date_1: "Jan. 2026 - Present · Libreville",
        exp_title_1: "Freelance Full-Stack Developer — HÔTEL YA",
        exp_text_1: "Architecture and development of an end-to-end hotel management ERP: mobile app (Flutter), modern web platform (React / Next.js), and desktop client — online reservations, automated billing, customer relationship CRM, inventory tracking, and executive analytics dashboard. REST API architecture, MySQL / PostgreSQL databases, secure auth, and cloud hosting.",

        exp_date_2: "April 2026 - Present · Libreville",
        exp_title_2: "Freelance Backend Developer — AARTFLIX",
        exp_text_2: "Backend engineering, database architecture, streaming pipeline optimization, and server administration for the video platform.",

        exp_date_3: "Aug. - Oct. 2025 · Port-Gentil",
        exp_title_3: "Full-Stack Developer — TECH INFO PLUS",
        exp_text_3: "Design and full-cycle implementation of an invoicing and inventory management ERP for an IT SME in Port-Gentil. Data modeling, responsive UI, database performance tuning, bug diagnostic, and corrective maintenance.",

        exp_date_4: "July - Sept. 2024 · Libreville",
        exp_title_4: "Full-Stack Developer — INPTIC",
        exp_text_4: "Development of a cross-platform academic evaluation system (PHP, MySQL, Bootstrap): relational database schema design, authentication, student grading workflow, and automated GPA calculations.",

        exp_date_5: "Jan. - June 2024 · Libreville",
        exp_title_5: "Freelance Mobile & Web Developer",
        exp_text_5: "Custom web and mobile applications for local businesses (commercial sales management, order fulfillment, admin interfaces): requirements analysis, UI prototyping, development, and delivery.",

        exp_date_6: "March - Dec. 2023 · Libreville",
        exp_title_6: "Freelance Mobile Developer — DELIVERY TRACKER",
        exp_text_6: "Android mobile application (Flutter) for delivery logistics and order dispatch for a local retailer: order generation, courier assignment, real-time GPS tracking, electronic proof of delivery, history, and billing. Node.js / PHP REST backend, MySQL, push notifications.",

        // Services
        services_title: "Services",
        srv_title_1: "Mobile App Development",
        srv_desc_1: "Building high-performance, intuitive Android and iOS applications tailored to your specific business requirements.",
        srv_title_2: "Web & SaaS Development",
        srv_desc_2: "Engineering modern, robust, and scalable websites and web applications for all types of projects.",
        srv_title_3: "Database Engineering",
        srv_desc_3: "Architecture, organization, and hardening of databases for secure, high-availability, and reliable access.",
        srv_title_4: "Cybersecurity & Hardening",
        srv_desc_4: "Safeguarding your systems, servers, and sensitive business data against unauthorized access and security threats.",
        srv_title_5: "IT Support & Maintenance",
        srv_desc_5: "Ensuring smooth operational uptime and maintenance of workstations and servers with responsive monitoring.",
        srv_title_6: "Network Administration",
        srv_desc_6: "Configuration, monitoring, and administration of enterprise network infrastructures for reliability and secure communications.",
        srv_title_7: "DBA Administration & Tuning",
        srv_desc_7: "Administration, query tuning, backup strategy, and performance optimization for mission-critical databases.",
        srv_title_8: "UI/UX Design & Prototyping",
        srv_desc_8: "Crafting intuitive, state-of-the-art UI/UX mockups and interactive prototypes before development to validate user journeys.",
        srv_title_9: "AI Solutions & Automation",
        srv_desc_9: "Integrating AI solutions into your apps: intelligent chatbots, automated recommendation engines, and workflow automation.",
        srv_title_10: "Cloud Deployment & DevOps",
        srv_desc_10: "Deploying production-ready applications on cloud infrastructures (Vercel, AWS, VPS) with CI/CD and environment orchestration.",

        // Work Process
        process_title: "My Work Process",
        process_lead: "A proven 5-step methodology to turn your ideas into reliable, high-performance, and scalable digital solutions.",
        process_step_1_title: "Discovery & Analysis",
        process_step_1_desc: "In-depth understanding of your goals, user requirements analysis, feasibility study, and detailed project specification.",
        process_step_1_b1: "Requirements collection & KPIs",
        process_step_1_b2: "Tech stack selection",
        process_step_1_b3: "Project roadmap & estimation",
        process_step_2_title: "Design & Architecture",
        process_step_2_desc: "Software architecture design, data modeling, and prototyping intuitive, modern UI/UX interfaces.",
        process_step_2_b1: "Interactive wireframes & mockups",
        process_step_2_b2: "Database & API architecture",
        process_step_2_b3: "User journey validation",
        process_step_3_title: "Development & Testing",
        process_step_3_desc: "Iterative agile development with clean, modular, and performant code, backed by continuous testing and regular demos.",
        process_step_3_b1: "Robust & secure clean code",
        process_step_3_b2: "Unit & integration testing",
        process_step_3_b3: "Iterative sprints & review demos",
        process_step_4_title: "Deployment & Delivery",
        process_step_4_desc: "Secure cloud release, SEO and speed optimization, domain and SSL setup, accompanied by comprehensive handover documentation.",
        process_step_4_b1: "Cloud CI/CD deployment pipeline",
        process_step_4_b2: "SEO & speed optimization",
        process_step_4_b3: "Complete handover & documentation",
        process_step_5_title: "Support & Maintenance",
        process_step_5_desc: "Post-launch support, real-time performance monitoring, automated backups, and continuous feature updates based on your needs.",
        process_step_5_b1: "Preventive & bugfix maintenance",
        process_step_5_b2: "Uptime monitoring & backups",
        process_step_5_b3: "Continuous feature evolution",
        process_cta_title: "Have a project in mind or an idea to build?",
        process_cta_desc: "Leverage a clear, proven methodology to bring your vision to life with personalized end-to-end guidance.",
        process_cta_btn: "Start a Project <i class=\"fas fa-arrow-right\"></i>",

        // Compétences
        skills_title: "Core Competencies",
        skill_p1_title: "Web & Backend Development",
        skill_p1_desc: "Modern full-stack web applications, scalable MVC architectures, and high-performance REST APIs.",
        skill_p2_title: "Mobile & Multiplatform",
        skill_p2_desc: "Responsive cross-platform mobile apps for Android & iOS, and native desktop software.",
        skill_p3_title: "Data & Artificial Intelligence",
        skill_p3_desc: "Relational & NoSQL database architecture, query optimization, and AI model integration.",
        skill_p4_title: "System Design & DevOps",
        skill_p4_desc: "Functional specifications modeling, Git version control workflows, and containerized deployment.",

        // Portfolio (Projets)
        portfolio_title: "Featured Projects",
        filter_all: "All",
        filter_web: "Web",
        filter_mobile: "Mobile",
        filter_desktop: "Desktop",

        proj_title_1: "Tradition-IA — Gabonese Languages Translation Application",
        proj_desc_1: "Responsive web application enabling instant translation between indigenous Gabonese languages with intuitive UI and lexical database.",
        proj_title_2: "Web Invoicing & Inventory App — Tech Info Plus",
        proj_desc_2: "Comprehensive invoicing and inventory control platform for an IT SME in Port-Gentil. Client CRM, vendors, products, quotations, settlements, and analytics.",
        proj_title_3: "GABON App — Popular Places & Landmarks",
        proj_desc_3: "Application showcasing popular tourism destinations across Gabon with user login, sign-up, and regional directory.",
        proj_title_4: "Mini Market Web Platform (School Project)",
        proj_desc_4: "E-commerce platform for an online market with vendor storefront, shopping cart, checkout, and admin dashboard.",
        proj_title_5: "Mobile Electronic Voting App",
        proj_desc_5: "Mobile app for real-time electronic voting with election administrators dashboard and ballot results tabulation.",
        proj_title_6: "AARTFLIX — Streaming Platform",
        proj_desc_6: "On-demand video streaming platform featuring an interactive multimedia catalog, smooth media playback, and robust backend and database administration.",
        proj_title_7: "HÔTEL YA — Hotel Management System",
        proj_desc_7: "Comprehensive multiplatform hotel management solution: online bookings, automated invoicing, customer relationship management, inventory tracking, and executive dashboard.",

        btn_hide_images: "Hide images",
        btn_show_images: "View images",
        btn_demo: "Live Demo",

        // Modals
        cv_modal_title: "Resume — Rosny OTSINA",
        cv_modal_dl: "Download Resume",
        cv_fallback_text: "Preview not available on this browser.",
        cert_modal_title: "Certificate",

        // Certifications
        cert_title: "Certifications",
        cert_desc: "My earned certifications and verified credentials.",
        cert_zoom: "Enlarge",
        cert_badge_ml: "Machine Learning",
        cert_badge_prog: "Programming",
        cert_badge_db: "Databases",

        // Contact
        contact_title: "Contact Me",
        contact_q: "Have Any Questions?",
        contact_sub: "I AM AT YOUR SERVICE",
        contact_call: "Call me at",
        contact_loc: "Location",
        contact_form_title: "SEND ME A MESSAGE",
        contact_form_sub: "I AM AVAILABLE 24/7",
        contact_ph_name: "Full Name",
        contact_ph_email: "Email Address",
        contact_ph_subj: "Subject",
        contact_ph_msg: "Your Message",
        contact_send_btn: "Send Message",
        contact_sending: "Sending...",
        contact_success: "Message sent successfully!",
        contact_error: "Error sending message.",

        // Footer & Divers
        footer_role: "Freelance Web & Mobile Developer",
        switcher_title: "Color Themes",

        // Chatbot
        chat_status: "Online &bull; Voice Assistant",
        chat_welcome: "Hello! I am Sophia, the AI assistant of Rosny OTSINA. I can tell you all about his projects, skills, and services. How can I help you today?",
        chat_play_title: "Play this message",
        chat_now: "Just now",
        chat_input_ph: "Ask Sophia a question..."
    }
};

window.currentLang = localStorage.getItem("portfolio_lang") || "fr";
var typedInstance = null;

function applyLanguage(lang) {
    window.currentLang = lang;
    localStorage.setItem("portfolio_lang", lang);
    document.documentElement.lang = lang;

    const dict = translations[lang] || translations.fr;

    // Traduction de tous les éléments avec data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key] !== undefined) {
            if (dict[key].includes("<") && dict[key].includes(">")) {
                el.innerHTML = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
    });

    // Traduction des placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
        const key = el.getAttribute("data-i18n-ph");
        if (dict[key] !== undefined) {
            el.setAttribute("placeholder", dict[key]);
        }
    });

    // Traduction des attributs title
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        if (dict[key] !== undefined) {
            el.setAttribute("title", dict[key]);
        }
    });

    // Mise à jour de l'état des boutons de carousels
    document.querySelectorAll(".proj-carousel").forEach(carousel => {
        const card = carousel.closest(".project-card");
        if (card) {
            const btn = card.querySelector(".btn-images");
            if (btn) {
                const isClosed = carousel.classList.contains("closed");
                if (isClosed) {
                    btn.innerHTML = '<i class="fas fa-images"></i> <span data-i18n="btn_show_images">' + dict.btn_show_images + '</span>';
                } else {
                    btn.innerHTML = '<i class="fas fa-chevron-up"></i> <span data-i18n="btn_hide_images">' + dict.btn_hide_images + '</span>';
                }
            }
        }
    });

    // Mise à jour de l'indicateur visuel du bouton FR / EN
    const optFr = document.getElementById("lang-opt-fr");
    const optEn = document.getElementById("lang-opt-en");
    if (optFr && optEn) {
        if (lang === "fr") {
            optFr.classList.add("active");
            optEn.classList.remove("active");
        } else {
            optEn.classList.add("active");
            optFr.classList.remove("active");
        }
    }

    // Mise à jour de Typed.js
    if (window.Typed) {
        if (typedInstance && typeof typedInstance.destroy === "function") {
            typedInstance.destroy();
        }
        typedInstance = new Typed(".typing", {
            strings: dict.typed_strings,
            typeSpeed: 80,
            backSpeed: 50,
            loop: true
        });
    }
}

/* ==================== NAVIGATION & INITIALISATION ==================== */
document.addEventListener("DOMContentLoaded", function() {
    // Initialiser la langue
    applyLanguage(window.currentLang);

    // Bouton de changement de langue
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
        langBtn.addEventListener("click", function() {
            const nextLang = window.currentLang === "fr" ? "en" : "fr";
            applyLanguage(nextLang);
        });
    }

    const navLinks = document.querySelectorAll(".site-header .nav li a, .nav li a");
    const navMenu = document.querySelector(".nav-menu");
    const navTogglerBtn = document.querySelector(".nav-toggler");
    const sections = document.querySelectorAll(".section");

    // Défilement fluide au clic sur un lien de navigation
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }

                // Fermer le menu mobile si ouvert
                if (navMenu && navMenu.classList.contains("open")) {
                    navMenu.classList.remove("open");
                }
                if (navTogglerBtn && navTogglerBtn.classList.contains("open")) {
                    navTogglerBtn.classList.remove("open");
                }
            }
        });
    });

    // Bouton "Engagez moi" (hire-me) -> défilement fluide vers contact
    const hireMeBtn = document.querySelector(".hire-me");
    if (hireMeBtn) {
        hireMeBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Toggle menu mobile (burger)
    if (navTogglerBtn && navMenu) {
        navTogglerBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            navTogglerBtn.classList.toggle("open");
            navMenu.classList.toggle("open");
        });
    }

    // Fermer le menu mobile au clic en dehors
    document.addEventListener("click", function(e) {
        if (navMenu && navMenu.classList.contains("open")) {
            if (!navMenu.contains(e.target) && navTogglerBtn && !navTogglerBtn.contains(e.target)) {
                navMenu.classList.remove("open");
                navTogglerBtn.classList.remove("open");
            }
        }
    });

    // ScrollSpy : mise à jour du lien actif au défilement en cascade
    if ("IntersectionObserver" in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.2,
            rootMargin: "-75px 0px -40% 0px"
        };

        const navObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(function(link) {
                        const href = link.getAttribute("href");
                        if (href === "#" + id) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(function(sec) {
            navObserver.observe(sec);
        });
    }
});
