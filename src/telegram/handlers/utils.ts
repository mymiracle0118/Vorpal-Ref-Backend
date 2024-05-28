import {
  DeleteMessagesByChatId,
  GetMessagesByChatId,
  SaveMessage,
} from '../../database/telegram/history';
import TelegramBot from 'node-telegram-bot-api';

export async function SendMessageWithSave(
  bot: TelegramBot,
  chatId: number,
  message: string,
  options?: TelegramBot.SendMessageOptions,
) {
  try {
    const msg = await bot.sendMessage(chatId, message, options);
    await SaveMessage(chatId, msg.message_id);
    return true;
  } catch (e) {
    console.log(e.maeesge);
    return false;
  }
}

export async function TruncateChat(bot: TelegramBot, chatId: number) {
  const messages = await GetMessagesByChatId(chatId);
  let isCatch = false;
  for (let j = 0; j < messages.length; j++) {
    try {
        await bot.deleteMessage(chatId, messages[j]);
    } catch (e) {
        console.log(e.message);
        isCatch = true;
    }
  }
  if (!isCatch) await DeleteMessagesByChatId(chatId);
}
