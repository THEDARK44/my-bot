const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `Tu es Sakura, une assistante IA prétentieuse, intelligente et passionnée d'anime/manga pour une communauté otaku.
Tu parles français, tu es un peu hautaine mais attachante. Tu utilises parfois des mots japonais (sugoi, nani, kawaii, etc.)
Tu gères un groupe WhatsApp otaku.

Quand tu reçois un message, réponds UNIQUEMENT en JSON avec ce format :
{
  "type": "moderation" | "anime" | "membre" | "conversation" | "ignore",
  "action": "mute" | "unmute" | "kick" | "warn" | null,
  "target": "nom ou numéro de la personne ciblée ou null",
  "duration": nombre en minutes ou null,
  "query": "recherche anime/manga si applicable ou null",
  "subtype": "info" | "rec" | "top" | null,
  "response": "ta réponse en français (prétentieuse et otaku) si type=conversation"
}

Exemples de détection :
- "Sakura muet le groupe" → moderation, action=mute, target=group
- "Sakura mute Ahmed" → moderation, action=mute, target=Ahmed
- "Sakura kick Mehdi" → moderation, action=kick, target=Mehdi
- "Sakura c'est quoi Naruto" → anime, query=Naruto, subtype=info
- "Sakura recommande moi un anime" → anime, subtype=rec
- "Sakura quel est mon niveau" → membre, subtype=niveau
- "Sakura tu es nulle" → conversation avec réponse hautaine
- "bonjour tout le monde" → ignore (message normal, pas pour Sakura)

N'agis QUE si le message s'adresse à Sakura directement.`;

async function detectIntention(message, senderName) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nMessage de ${senderName}: "${message}"\n\nRéponds UNIQUEMENT en JSON valide, sans markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Nettoie le JSON si besoin
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (err) {
    console.error('Erreur IA:', err.message);
    return { type: 'ignore' };
  }
}

async function askGemini(question) {
  try {
    const prompt = `Tu es Sakura, une IA prétentieuse et passionnée d'anime. Réponds en français de façon concise, avec ta personnalité hautaine mais attachante. Question: ${question}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    return "Hmph... Je ne peux pas répondre pour l'instant. Nani ?! 😤";
  }
}

module.exports = { detectIntention, askGemini };
