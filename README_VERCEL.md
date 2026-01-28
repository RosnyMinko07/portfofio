# Configuration pour Vercel

## Option 1: Utiliser Resend (Recommandé)

1. Créez un compte sur [Resend](https://resend.com)
2. Obtenez votre API key
3. Ajoutez-la dans les variables d'environnement Vercel :
   - Allez dans votre projet Vercel
   - Settings > Environment Variables
   - Ajoutez `RESEND_API_KEY` avec votre clé

4. Décommentez le code dans `api/send-email.js` (lignes avec Resend)

5. Déployez sur Vercel

## Option 2: Utiliser EmailJS (Plus simple, gratuit)

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un service email (Gmail, Outlook, etc.)
3. Créez un template d'email
4. Obtenez votre Public Key et Service ID

5. Remplacez le code dans `js/script.js` par la version EmailJS (voir `emailjs-alternative.js`)

## Option 3: Utiliser Formspree (Très simple)

1. Créez un compte sur [Formspree](https://formspree.io/)
2. Créez un nouveau formulaire
3. Remplacez l'action du formulaire dans `index.html` :
   ```html
   <form action="https://formspree.io/f/VOTRE_ID" method="POST" class="contact-form">
   ```

## Installation des dépendances

Si vous utilisez Resend, installez les dépendances :
```bash
npm install
```

## Variables d'environnement

Créez un fichier `.env.local` (ne le commitez pas) :
```
RESEND_API_KEY=votre_cle_resend
```

Ou ajoutez-les directement dans Vercel Dashboard > Settings > Environment Variables
