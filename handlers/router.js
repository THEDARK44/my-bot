const { detectIntention } = require('./ia');
const { handleModeration } = require('./moderation');
const { handleAnime } = require('./anime');
const { handleMembre } = require('./membres');

async function handleMessage(client, msg) {
  try {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const body = msg.body?.trim().toLowerCase();

    if (!body) return;

    // Détecte l'intention via IA
    const intention = await detectIntention(body, contact.pushname || contact.number);

    switch (intention.type) {
      case 'moderation':
        await handleModeration(client, msg, chat, intention);
        break;
      case 'anime':
        await handleAnime(client, msg, intention);
        break;
      case 'membre':
        await handleMembre(client, msg, chat, contact, intention);
        break;
      case 'conversation':
        await msg.reply(intention.response);
        break;
      default:
        break; // Ignore les messages normaux
    }
  } catch (err) {
    console.error('Erreur handleMessage:', err.message);
  }
}

module.exports = { handleMessage };
