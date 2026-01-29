// build.js - Script pour créer le dossier public pour Vercel
const fs = require('fs');
const path = require('path');

// Créer le dossier public s'il n'existe pas
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

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

const excludeDirs = ['node_modules', '.git', 'api', 'public', '.vercel'];

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      if (!excludeDirs.includes(childItemName)) {
        copyRecursive(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copier les fichiers
filesToCopy.forEach(item => {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(publicDir, item);
  
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
});

console.log('✅ Build terminé - Dossier public créé avec succès');
