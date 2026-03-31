const { Client, LocalAuth } = require('whatsapp-web.js');
const { handleMessage } = require('./handlers/router');
const { initDB } = require('./data/db');

// ✅ Mets ton numéro ici au format international (sans + ni espaces)
// Exemple : 33612345678 pour un numéro français
const PHONE_NUMBER = process.env.PHONE_NUMBER || '2250596717956';

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'sakura' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

// Pairing code - plus besoin de scanner un QR !
client.on('qr', async () => {
  try {
    const code = await client.requestPairingCode(PHONE_NUMBER);
    console.log(`\n🌸 ==========================================`);
    console.log(`   TON CODE DE JUMELAGE SAKURA : ${code}`);
    console.log(`🌸 ==========================================`);
    console.log(`\n👉 Sur WhatsApp → Paramètres → Appareils connectés`);
    console.log(`   → Connecter avec numéro de téléphone → Entre le code\n`);
  } catch (err) {
    console.error('Erreur pairing code:', err.message);
  }
});

client.on('ready', async () => {
  console.log('✅ Sakura est en ligne ! 🌸');
  await initDB();
});

client.on('message_create', async (msg) => {
  if (msg.fromMe) return;
  await handleMessage(client, msg);
});

client.on('disconnected', (reason) => {
  console.log('❌ Sakura déconnectée :', reason);
  process.exit(1);
});

client.initialize();
