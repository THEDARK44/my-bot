const axios = require('axios');

const JIKAN_BASE = 'https://api.jikan.moe/v4';

async function handleAnime(client, msg, intention) {
  const { query, subtype } = intention;

  switch (subtype) {
    case 'info':
      await getAnimeInfo(msg, query);
      break;
    case 'rec':
      await getRecommendations(msg);
      break;
    case 'top':
      await getTopAnime(msg);
      break;
    default:
      await getAnimeInfo(msg, query);
  }
}

async function getAnimeInfo(msg, query) {
  if (!query) {
    return msg.reply("Tu cherches des infos sur... quoi exactement ? Sois plus précis(e) ! 😤🌸");
  }

  try {
    await msg.reply(`🔍 Je recherche "${query}"... Attends, je ne cours pas pour toi hein. 💅`);

    const res = await axios.get(`${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=1`);
    const anime = res.data.data?.[0];

    if (!anime) {
      return msg.reply(`Hmph... Je n'ai rien trouvé pour "${query}". Tu es sûr(e) que ça existe ? 🧐`);
    }

    const score = anime.score ? `⭐ ${anime.score}/10` : 'Score inconnu';
    const episodes = anime.episodes ? `${anime.episodes} épisodes` : 'En cours';
    const status = anime.status === 'Finished Airing' ? '✅ Terminé' : '📡 En cours';
    const genres = anime.genres?.map(g => g.name).join(', ') || 'Non renseigné';
    const synopsis = anime.synopsis
      ? anime.synopsis.substring(0, 200) + '...'
      : 'Pas de synopsis disponible.';

    const response = `🌸 *${anime.title}* (${anime.title_japanese || ''})

${score} | ${episodes} | ${status}
🎭 Genres: ${genres}
📅 Année: ${anime.year || 'Inconnue'}

📖 ${synopsis}

Hmph, t'avais vraiment besoin de moi pour ça ? 💅`;

    await msg.reply(response);
  } catch (err) {
    await msg.reply("L'API Jikan est indisponible... Même moi j'ai mes limites ! 😤");
  }
}

async function getRecommendations(msg) {
  try {
    await msg.reply("Je prépare une sélection digne de mes standards... 🌸");

    const res = await axios.get(`${JIKAN_BASE}/top/anime?filter=bypopularity&limit=5`);
    const animes = res.data.data;

    if (!animes?.length) throw new Error('Pas de résultats');

    let response = `🌸 *Ma sélection exclusive* (tu es chanceux/se) :\n\n`;
    animes.forEach((a, i) => {
      response += `${i + 1}. *${a.title}* — ⭐ ${a.score || '?'}/10\n`;
    });
    response += `\nHmph, de rien. Ces animes sont à la hauteur de mon niveau. 💅`;

    await msg.reply(response);
  } catch (err) {
    await msg.reply("Je n'arrive pas à récupérer des recommandations... Nani ?! 😤");
  }
}

async function getTopAnime(msg) {
  try {
    const res = await axios.get(`${JIKAN_BASE}/top/anime?limit=10`);
    const animes = res.data.data;

    let response = `👑 *Top 10 Anime de tous les temps selon Sakura* :\n\n`;
    animes.forEach((a, i) => {
      response += `${i + 1}. *${a.title}* — ⭐ ${a.score || '?'}\n`;
    });
    response += `\nCe classement est objectif. Fin de la discussion. 💅🌸`;

    await msg.reply(response);
  } catch (err) {
    await msg.reply("Impossible de récupérer le top... 😤");
  }
}

module.exports = { handleAnime };
