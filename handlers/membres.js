const { getMembre, updateMembre } = require('../data/db');

const NIVEAUX = [
  { level: 1, nom: '🌱 Genin Otaku', xp: 0 },
  { level: 2, nom: '⚔️ Chunin Otaku', xp: 100 },
  { level: 3, nom: '🔥 Jonin Otaku', xp: 300 },
  { level: 4, nom: '💎 Kage Otaku', xp: 600 },
  { level: 5, nom: '👑 Otaku Légendaire', xp: 1000 },
];

function getNiveau(xp) {
  let current = NIVEAUX[0];
  for (const n of NIVEAUX) {
    if (xp >= n.xp) current = n;
  }
  return current;
}

async function handleMembre(client, msg, chat, contact, intention) {
  const { subtype } = intention;
  const userId = contact.id._serialized;
  const chatId = chat.id._serialized;

  switch (subtype) {
    case 'niveau':
      await showNiveau(msg, userId, chatId, contact.pushname);
      break;
    case 'top':
      await showTopMembres(msg, chatId);
      break;
    default:
      await showNiveau(msg, userId, chatId, contact.pushname);
  }
}

async function showNiveau(msg, userId, chatId, name) {
  try {
    const data = await getMembre(userId, chatId);
    const xp = data?.xp || 0;
    const niveau = getNiveau(xp);
    const nextNiveau = NIVEAUX.find(n => n.xp > xp);

    let response = `🌸 *Profil de ${name || 'toi'}*\n\n`;
    response += `🎖️ Rang: ${niveau.nom}\n`;
    response += `⚡ XP: ${xp}`;

    if (nextNiveau) {
      const reste = nextNiveau.xp - xp;
      response += `\n📈 Prochain rang: ${nextNiveau.nom} (encore ${reste} XP)`;
    } else {
      response += `\n👑 Tu as atteint le rang maximum. Impressionnant... je suppose.`;
    }

    response += `\n\nHmph, t'as encore du chemin à faire. 💅🌸`;
    await msg.reply(response);
  } catch (err) {
    await msg.reply("Erreur lors de la récupération de ton profil... 😤");
  }
}

// Fonction appelée à chaque message pour gagner de l'XP
async function addXP(userId, chatId) {
  try {
    const data = await getMembre(userId, chatId);
    const xp = (data?.xp || 0) + Math.floor(Math.random() * 5) + 1; // +1 à +5 XP par message
    await updateMembre(userId, chatId, { xp });
  } catch (err) {
    // Silencieux
  }
}

module.exports = { handleMembre, addXP };
