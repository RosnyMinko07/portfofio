# Guide de débogage du Chatbot

## Problème : "Désolé, une erreur est survenue"

### Causes possibles et solutions

#### 1. ✅ Clé API Google Gemini non configurée

**Symptôme** : Le chatbot répond toujours "Désolé, une erreur est survenue"

**Solution** :
1. Allez sur https://vercel.com
2. Ouvrez votre projet
3. Settings → Environment Variables
4. Vérifiez que `GOOGLE_GEMINI_API_KEY` existe
5. Si elle n'existe pas, ajoutez-la :
   - Key: `GOOGLE_GEMINI_API_KEY`
   - Value: Votre clé API (commence par `AIza...`)
   - Cochez: Production, Preview, Development
6. **Redéployez** votre projet après avoir ajouté la variable

#### 2. ✅ Vérifier les logs Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur **Deployments**
3. Ouvrez le dernier déploiement
4. Cliquez sur **Functions** → `api/chatbot`
5. Regardez les **Logs** pour voir les erreurs exactes

#### 3. ✅ Tester l'API directement

Ouvrez la console du navigateur (F12) et regardez les erreurs dans l'onglet **Console** ou **Network**.

#### 4. ✅ Vérifier que la clé API est valide

1. Allez sur https://aistudio.google.com/app/apikey
2. Vérifiez que votre clé API est active
3. Testez-la avec une requête simple si possible

#### 5. ✅ Vérifier les quotas Google Gemini

- Vérifiez que vous n'avez pas dépassé les limites de requêtes
- Vérifiez que votre compte Google Gemini est actif

### Messages d'erreur spécifiques

- **"Configuration API manquante"** → La clé API n'est pas configurée sur Vercel
- **"Limite de requêtes atteinte"** → Vous avez dépassé le quota Google Gemini
- **"Modèle IA non disponible"** → Le modèle Gemini n'est pas accessible
- **"Erreur de connexion"** → Problème réseau ou l'API n'est pas accessible

### Test rapide

Ouvrez la console du navigateur (F12) et tapez :
```javascript
fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Bonjour' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Cela vous montrera l'erreur exacte retournée par l'API.
