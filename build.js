// build.js - Script pour créer le dossier public pour Vercel
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du build...');

// Créer le dossier public s'il n'existe pas (le supprimer d'abord s'il existe)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('📁 Suppression de l\'ancien dossier public...');
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });
console.log('✅ Dossier public créé');

// Copier tous les fichiers statiques dans public (sauf node_modules, .git, api, etc.)
const filesToCopy = [
  'index.html',
  'css',
  'js',
  'images',
  'pdf',
  'CONFIGURATION.md',
  'README_VERCEL.md',
  'README.mdgit'
];

const excludeDirs = ['node_modules', '.git', 'api', 'public', '.vercel', 'build.js', 'package.json', 'package-lock.json', 'vercel.json', '.env.local', '.env'];

function copyRecursive(src, dest) {
  try {
    const exists = fs.existsSync(src);
    if (!exists) {
      return;
    }
    
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();
    
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const items = fs.readdirSync(src);
      items.forEach(childItemName => {
        if (!excludeDirs.includes(childItemName) && !childItemName.startsWith('.')) {
          copyRecursive(
            path.join(src, childItemName),
            path.join(dest, childItemName)
          );
        }
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la copie de ${src}:`, error.message);
  }
}

// Copier les fichiers
let copiedCount = 0;
filesToCopy.forEach(item => {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(publicDir, item);
  
  if (fs.existsSync(srcPath)) {
    console.log(`📋 Copie de ${item}...`);
    copyRecursive(srcPath, destPath);
    copiedCount++;
  } else {
    console.warn(`⚠️  ${item} n'existe pas, ignoré`);
  }
});

// Vérifier que le dossier public contient des fichiers
const publicFiles = fs.readdirSync(publicDir);
if (publicFiles.length === 0) {
  console.error('❌ ERREUR: Le dossier public est vide!');
  process.exit(1);
}

// Vérifier que index.html existe
if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
  console.error('❌ ERREUR: index.html n\'existe pas dans public/!');
  process.exit(1);
}

console.log(`✅ Build terminé - ${copiedCount} éléments copiés dans public/`);
console.log(`📦 Contenu du dossier public: ${publicFiles.join(', ')}`);
console.log(`✅ Vérification: index.html existe dans public/`);
