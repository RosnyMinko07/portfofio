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
- Le chatbot utilise le modèle `gemini-pro` de Google
