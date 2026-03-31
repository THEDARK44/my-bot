const { addWarn, getWarns } = require('../data/db');

const MAX_WARNS = 3;

async function handleModeration(client, msg, chat, intention) {
  const { action, target, duration } = intention;

  // Vérifie que c'est un groupe
  if (!chat.isGroup) {
    return msg.reply("Hmph... Cette commande est réservée aux groupes. Tu ne savais pas ? 😏");
  }

  // Vérifie les permissions de l'expéditeur
  const sender = await msg.getContact();
  const participants = chat.participants;
  const senderParticipant = participants.find(p => p.id._serialized === sender.id._serialized);

  if (!senderParticipant?.isAdmin) {
    return msg.reply("Naaan mais... Tu crois vraiment que je vais obéir à un simple membre ? Seulement les admins peuvent me donner des ordres. 💅");
  }

  switch (action) {
    case 'mute':
      await muteAction(client, msg, chat, target, duration);
      break;
    case 'unmute':
      await unmuteAction(msg, chat);
      break;
    case 'kick':
      await kickAction(msg, chat, target, participants);
      break;
    case 'warn':
      await warnAction(msg, chat, target, participants, sender);
      break;
    default:
      msg.reply("Je n'ai pas compris cette action de modération... Sois plus précis(e) ! 😤");
  }
}

async function muteAction(client, msg, chat, target, duration) {
  try {
    if (target === 'group' || target === 'groupe' || !target) {
      // Mute tout le groupe
      await chat.setMessagesAdminsOnly(true);
      const dureeMsg = duration ? `pour ${duration} minutes` : '';
      await msg.reply(`🔇 Le groupe est maintenant en mode silencieux ${dureeMsg}. Seuls les admins peuvent parler. Comme il se doit ! 💅🌸`);

      // Auto-unmute si durée spécifiée
      if (duration && duration > 0) {
        setTimeout(async () => {
          await chat.setMessagesAdminsOnly(false);
          await client.sendMessage(chat.id._serialized, `🔊 Le groupe est de nouveau ouvert ! Vous pouvez parler... dans le respect bien sûr. Hmph. 🌸`);
        }, duration * 60 * 1000);
      }
    } else {
      // Mute une personne spécifique → warn + message
      await msg.reply(`⚠️ @${target} a été signalé(e) par un admin. Encore un écart et tu seras exclu(e). Compris ? 😤🌸`);
    }
  } catch (err) {
    await msg.reply("Erreur lors du mute... Vérifie que je suis admin ! 😤");
  }
}

async function unmuteAction(msg, chat) {
  try {
    await chat.setMessagesAdminsOnly(false);
    await msg.reply("🔊 Le groupe est de nouveau ouvert. Vous pouvez parler... mais restez corrects ! 🌸");
  } catch (err) {
    await msg.reply("Impossible de désactiver le mute. Suis-je admin ? 🤔");
  }
}

async function kickAction(msg, chat, target, participants) {
  try {
    // Cherche le participant par son nom ou numéro
    const targetParticipant = participants.find(p => {
      return p.id.user.includes(target) || target?.toLowerCase().includes(p.id.user);
    });

    if (!targetParticipant) {
      return msg.reply(`Hmm... Je ne trouve pas "${target}" dans le groupe. Vérifie le nom ou le numéro. 🧐`);
    }

    await chat.removeParticipants([targetParticipant.id._serialized]);
    await msg.reply(`👋 ${target} a été exclu(e) du groupe. Au revoir ! La qualité avant la quantité, c'est ma philosophie. 💅🌸`);
  } catch (err) {
    await msg.reply("Impossible de kick... Je dois être admin avec les droits nécessaires ! 😤");
  }
}

async function warnAction(msg, chat, target, participants, sender) {
  try {
    const targetParticipant = participants.find(p =>
      p.id.user.includes(target) || target?.toLowerCase().includes(p.id.user)
    );

    if (!targetParticipant) {
      return msg.reply(`Je ne trouve pas "${target}"... 🧐`);
    }

    const userId = targetParticipant.id._serialized;
    const warns = await addWarn(userId, chat.id._serialized);

    if (warns >= MAX_WARNS) {
      await chat.removeParticipants([userId]);
      await msg.reply(`🚫 @${target} a reçu ${warns} avertissements et a été exclu(e). J'avais prévenu ! 💅`);
    } else {
      await msg.reply(`⚠️ @${target} : avertissement ${warns}/${MAX_WARNS}. ${MAX_WARNS - warns} restant(s) avant l'exclusion. Sakura t'a à l'œil ! 👁️🌸`);
    }
  } catch (err) {
    await msg.reply("Erreur lors du warn... 😤");
  }
}

module.exports = { handleModeration };
