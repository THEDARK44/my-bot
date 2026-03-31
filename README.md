# 🌸 Sakura Bot - Bot WhatsApp Otaku

Bot WhatsApp prétentieux et intelligent pour gérer une communauté otaku.

## ✨ Fonctionnalités

- **Modération en langage naturel** : `Sakura muet le groupe`, `Sakura kick Ahmed`
- **Infos anime/manga** : `Sakura c'est quoi Naruto ?`
- **Recommandations** : `Sakura recommande-moi un anime`
- **Top anime** : `Sakura donne-moi le top anime`
- **Niveau membres** : `Sakura quel est mon niveau`
- **IA conversationnelle** : répond à tout ce qu'on lui adresse

## 🚀 Installation locale

```bash
# 1. Clone ou télécharge le projet
cd sakura-bot

# 2. Installe les dépendances
npm install

# 3. Configure l'environnement
cp .env.example .env
# Édite .env et mets ta clé Gemini

# 4. Lance le bot
npm start

# 5. Scanne le QR code avec WhatsApp
```

## 🚂 Déploiement sur Railway

1. **Crée un compte** sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Push ton code sur GitHub d'abord :
   ```bash
   git init
   git add .
   git commit -m "🌸 Sakura bot initial"
   git remote add origin TON_REPO_GITHUB
   git push -u origin main
   ```
4. Dans Railway → **Variables** → ajoute :
   - `GEMINI_API_KEY` = ta clé Gemini
5. **Deploy** !

> ⚠️ **Important Railway** : whatsapp-web.js nécessite Chromium. Dans Railway, ajoute aussi :
> - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
> - `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
>
> Et dans Railway Settings → **Dockerfile** ou utilise le buildpack Node.js standard.

## 📋 Commandes disponibles

| Ce que tu dis | Ce que Sakura fait |
|---|---|
| `Sakura muet le groupe` | Mute tout le groupe |
| `Sakura muet le groupe 30` | Mute 30 minutes |
| `Sakura unmute le groupe` | Unmute le groupe |
| `Sakura kick [nom]` | Exclut quelqu'un |
| `Sakura warn [nom]` | Avertit quelqu'un (3 warns = kick) |
| `Sakura c'est quoi [anime]` | Infos sur un anime |
| `Sakura recommande-moi un anime` | Recommandations |
| `Sakura top anime` | Top 10 anime |
| `Sakura mon niveau` | Ton XP et rang |

## 🔑 Obtenir une clé Gemini gratuite

1. Va sur [aistudio.google.com](https://aistudio.google.com)
2. Connecte-toi avec Google
3. **Get API Key** → **Create API Key**
4. Copie la clé dans ton fichier `.env`

## 📁 Structure

```
sakura-bot/
├── index.js              # Point d'entrée
├── handlers/
│   ├── router.js         # Dispatch des messages
│   ├── ia.js             # Gemini AI
│   ├── moderation.js     # Mute/kick/warn
│   ├── anime.js          # API Jikan
│   └── membres.js        # XP et niveaux
├── data/
│   └── db.js             # SQLite
├── .env.example
└── package.json
```
