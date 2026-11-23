# Configuration

Le projet a deux parties :

1. **Le portfolio** (site statique + fonctions Vercel `api/chatbot.js` et `api/send-email.js`), hébergé sur Vercel.
2. **La veille emploi Gabon** (`scripts/job-alert-watch.js`), lancée toutes les 30 minutes par GitHub Actions.

Toutes les variables sont décrites dans [.env.example](.env.example). Copie ce fichier en `.env.local` pour travailler en local : `.env.local` est ignoré par git et ne doit jamais être commité.

---

## 1. Portfolio (Vercel)

Dans Vercel → **Settings → Environment Variables**, ajoute :

| Variable | Rôle |
| --- | --- |
| `OPENROUTER_API_KEY` | Chatbot IA du portfolio (modèles DeepSeek via OpenRouter) |
| `RESEND_API_KEY` | Envoi des messages du formulaire de contact |
| `NOTIFICATION_EMAIL` | Adresse qui reçoit les messages du formulaire |
| `ALLOWED_ORIGINS` | (Optionnel) Autres sites autorisés à appeler `/api/chatbot` |

Puis redéploie (bouton **Redeploy** ou nouveau commit).

Test en local :

```bash
npm install
npx vercel dev
```

Protections en place : le chatbot refuse les appels venant d'autres sites, limite chaque visiteur à 10 messages par minute et borne la taille des messages ; le build ne publie que `index.html`, `css`, `js`, `images` et `pdf`.

---

## 2. Veille emploi Gabon (GitHub Actions)

À chaque passage (toutes les 30 min), la veille :

1. récupère les offres publiées au Gabon, tous secteurs, sur **emploi.ga** et **LinkedIn** ;
2. ne garde que celles jamais envoyées (mémoire conservée dans le cache GitHub Actions) ;
3. lit le détail de chaque nouvelle offre et écarte les offres fermées ;
4. classe chaque offre (🟢 très pertinent, 🟡 à regarder, ⚪ hors profil) et résume missions, profil demandé, date limite et modalités de candidature ;
5. envoie le tout sur **Telegram** et par **email**.

L'IA ne fait que résumer et classer de vraies offres : elle n'en invente aucune. Sans clé OpenRouter, le classement se fait par mots-clés.

### Mise en place

1. **Telegram** : crée un bot avec **@BotFather** (`/newbot`), copie le token dans `.env.local` (`TELEGRAM_BOT_TOKEN=...`), envoie un message à ton bot, puis lance `npm run telegram:chat-id` pour obtenir `TELEGRAM_CHAT_ID`.
2. **Email** : clé Resend (`RESEND_API_KEY`) et adresse de réception (`NOTIFICATION_EMAIL`). Avec l'expéditeur par défaut `onboarding@resend.dev`, cette adresse doit être celle de ton compte Resend.
3. **Secrets GitHub** : dépôt → **Settings → Secrets and variables → Actions** → ajoute `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL` et `OPENROUTER_API_KEY`.
4. **Premier lancement** : onglet **Actions** → **Veille emploi Gabon** → **Run workflow**. Le premier passage mémorise les offres déjà en ligne et t'envoie « Veille activée » sur Telegram ; ensuite, seules les nouvelles offres arrivent.

### Réglages optionnels (onglet Variables, pas Secrets)

- `TELEGRAM_NIVEAU_MIN` : `moyenne` pour ne recevoir sur Telegram que les offres 🟢 et 🟡 (l'email garde tout).
- `OPENROUTER_MODEL` : autre modèle OpenRouter que `deepseek/deepseek-chat`.

### Tester en local

```bash
npm run watch:jobs
```

La mémoire locale est stockée dans `.data/seen-jobs.json` (ignoré par git), séparée de celle de GitHub Actions.

### Limites connues

- LinkedIn bloque parfois les requêtes (HTTP 429) : la source est alors ignorée pour ce passage.
- AltEmploi n'est pas couvert (offres chargées en JavaScript) ; Jobartis Gabon a été retiré (offres toutes fermées depuis 2020).
- GitHub peut décaler un passage de quelques minutes et suspend les tâches planifiées d'un dépôt public après 60 jours sans commit.
