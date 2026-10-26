# Configuration du Chatbot IA avec Google Gemini

## 📋 Prérequis

1. Une clé API Google Gemini
   - Obtenez votre clé sur: https://aistudio.google.com/app/apikey
   - Ou sur: https://makersuite.google.com/app/apikey

## 🚀 Configuration sur Vercel

### Étape 1: Ajouter la variable d'environnement

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings**
3. Allez dans **Environment Variables**
4. Cliquez sur **Add New**
5. Ajoutez:
   - **Variable name**: `GOOGLE_GEMINI_API_KEY`
   - **Variable value**: Votre clé API Google Gemini
   - **Environment**: Production, Preview, Development (cochez tous)
6. Cliquez sur **Save**

### Étape 2: Redéployer

Après avoir ajouté la variable d'environnement, redéployez votre projet:
- Soit via le dashboard Vercel (cliquez sur "Redeploy")
- Soit en poussant un nouveau commit

## 📦 Installation locale (pour développement)

Si vous voulez tester en local:

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement Vercel
npx vercel dev
```

Créez un fichier `.env.local` à la racine du projet:
```
GOOGLE_GEMINI_API_KEY=votre_cle_api_ici
```

## ✅ Vérification

Une fois configuré, le chatbot devrait:
- Répondre avec l'IA Google Gemini
- Avoir des réponses contextuelles et intelligentes
- Conserver l'historique de conversation (5 derniers messages)

## 🔧 Structure des fichiers

- `api/chatbot.js` - API backend qui utilise Google Gemini
- `js/chatbot.js` - Frontend qui appelle l'API
- `package.json` - Dépendances du projet

## ⚠️ Notes importantes

- La clé API ne doit JAMAIS être commitée dans le repository
- Utilisez toujours les variables d'environnement de Vercel
- Le chatbot utilise le modèle `gemini-pro` ou `deepseek` via OpenRouter

---

# 🇬🇦 Système Multi-Agents d'Alerte Emploi Gabon (8h00)

Le système scanne le marché de l'emploi tech au Gabon (Libreville / Port-Gentil) et t'alerte tous les matins à **08h00** par **Email** et **WhatsApp**.

### 🌐 Plateformes et sites surveillés par l'Agent :
1. **LinkedIn Jobs Gabon** (Requêtes ciblées : *Développeur Libreville* & *Informatique Gabon*)
2. **AltEmploi Gabon** (`altemploi5.com` — cabinet de recrutement à Libreville)
3. **Emploi.ga** (Portail national de référence)
4. **Gabon du Numérique** (ESN et projets de digitalisation)
5. **Jobartis Gabon** (Portail d'offres techniques)
6. Les ESN, télécoms (Airtel, Moov) et groupes industriels (SOBRAGA / Castel)

## 📱 1. Configuration WhatsApp (Gratuit en 10 secondes)

Pour recevoir automatiquement les alertes sur ton WhatsApp (`+241 077 12 24 85`) via l'API CallMeBot :
1. Enregistre le numéro du bot dans tes contacts WhatsApp : **`+34 941 83 20 12`** (ou `+34 644 44 20 72`).
2. Envoie-lui le message suivant sur WhatsApp :
   ```
   I allow callmebot to send me messages
   ```
3. Le bot te répond instantanément avec ta clé d'API personnelle (ex: `123456`).
4. Ajoute dans ton fichier `.env.local` et sur Vercel :
   ```
   CALLMEBOT_API_KEY=ta_cle_ici
   WHATSAPP_PHONE=241077122485
   ```

## 📧 2. Configuration Email (Resend)

Pour recevoir le récapitulatif HTML design sur `rodrigueotsina@gmail.com` :
1. Crée un compte gratuit sur [https://resend.com](https://resend.com).
2. Génère une clé API (`re_xxxxxxxx`).
3. Ajoute dans `.env.local` et sur Vercel :
   ```
   RESEND_API_KEY=re_xxxxxxxx
   NOTIFICATION_EMAIL=rodrigueotsina@gmail.com
   ```

## ⏰ 3. Planification automatique à 08h00

* **Sur ton PC Windows :** La tâche planifiée Windows `RosnyJobHunterGabon` a été créée et s'exécute automatiquement chaque jour à **08h00** !
* **Sur Vercel (Production) :** Le fichier `vercel.json` est configuré avec un Cron Job (`0 7 * * *`, soit 08h00 heure de Libreville) qui appelle `/api/cron-job-hunter`.
* **Test manuel à tout moment :**
  ```bash
  npm run hunt
  ```
