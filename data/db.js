const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../sakura.db');
let db;

function initDB() {
  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS membres (
      id TEXT,
      chat_id TEXT,
      xp INTEGER DEFAULT 0,
      messages INTEGER DEFAULT 0,
      PRIMARY KEY (id, chat_id)
    );

    CREATE TABLE IF NOT EXISTS warns (
      id TEXT,
      chat_id TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (id, chat_id)
    );
  `);

  console.log('💾 Base de données initialisée !');
}

function getMembre(userId, chatId) {
  if (!db) return null;
  return db.prepare('SELECT * FROM membres WHERE id = ? AND chat_id = ?').get(userId, chatId);
}

function updateMembre(userId, chatId, data) {
  if (!db) return;
  const existing = getMembre(userId, chatId);
  if (existing) {
    db.prepare('UPDATE membres SET xp = ?, messages = messages + 1 WHERE id = ? AND chat_id = ?')
      .run(data.xp, userId, chatId);
  } else {
    db.prepare('INSERT INTO membres (id, chat_id, xp, messages) VALUES (?, ?, ?, 1)')
      .run(userId, chatId, data.xp || 0);
  }
}

function addWarn(userId, chatId) {
  if (!db) return 0;
  const existing = db.prepare('SELECT * FROM warns WHERE id = ? AND chat_id = ?').get(userId, chatId);
  if (existing) {
    db.prepare('UPDATE warns SET count = count + 1 WHERE id = ? AND chat_id = ?').run(userId, chatId);
    return existing.count + 1;
  } else {
    db.prepare('INSERT INTO warns (id, chat_id, count) VALUES (?, ?, 1)').run(userId, chatId);
    return 1;
  }
}

function getWarns(userId, chatId) {
  if (!db) return 0;
  const row = db.prepare('SELECT count FROM warns WHERE id = ? AND chat_id = ?').get(userId, chatId);
  return row?.count || 0;
}

module.exports = { initDB, getMembre, updateMembre, addWarn, getWarns };
