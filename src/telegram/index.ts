import { Markup } from 'telegraf';
import { TelegramAuthData } from '../types';
import { GetDaylyAuthDate, CreateTelegramAuthHash } from '../utils/auth';
import { AddDuelOpponent, CreateDuel, FinishDuel, GetDuelDataByUser } from '../database/duel';
import { duel_lifetime } from '../config';

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const tg_token = process.env.TELEGRAM_API_TOKEN;

export function TelegramBotLaunch() {
  const bot = new TelegramBot(tg_token, { polling: true });

  const startHandler = (duel = false) => {
    return async (msg, match) => {
      const chatId = msg.chat.id;
      console.log('Chat started: ', chatId);
      if (duel) console.log('Match params', match);

      try {
        const linkAuthDataPrev: TelegramAuthData = {
          auth_date: GetDaylyAuthDate(),
          last_name: msg.from.last_name || '',
          first_name: msg.from.first_name,
          id: msg.from.id,
          username: msg.from.username || '',
          hash: '',
        };
        const authHash = CreateTelegramAuthHash(linkAuthDataPrev);
        const app_url = `${
          process.env.TELEGRAM_CLIENT_URL
        }?authHash=${authHash}&authDate=${GetDaylyAuthDate()}`;

        console.log('Starmap url: ', app_url);

        const inviterLogin = match[1];
 
        if (duel && !msg.from.username) {
          bot.sendMessage(
            chatId,
            'Welcome! You need to have a visible username to enter a duel',
            Markup.keyboard([
              Markup.button.webApp('Start vorpal game', app_url),
            ]),
          );
          return;
        }

        const createdDuel = await GetDuelDataByUser(inviterLogin);
        console.log('Last duel: ', createdDuel);
        const dateSec = Math.round(new Date().getTime() / 1000);
        if (!createdDuel) {
          bot.sendMessage(
            chatId,
            'Welcome! Enter duel command to play with friends',
            Markup.keyboard([
              Markup.button.webApp('Start vorpal game', app_url),
            ]),
          );
        } else {
          if (duel && !createdDuel.isfinished && 
            dateSec - createdDuel.creation < duel_lifetime && 
            (createdDuel.login1 && !createdDuel.login2)) {
             await AddDuelOpponent (createdDuel.duel_id, msg.from.username);
             bot.sendMessage(
              chatId,
              `You joined to a duel with a @${inviterLogin}, go to starmap:`,
              Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
            );
            return;
          }
          if (!createdDuel.isfinished && dateSec - createdDuel.creation < duel_lifetime ) {
            if (createdDuel.login1 && createdDuel.login2) {
              bot.sendMessage(
                chatId,
                'You already in duel, go to starmap:',
                Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
              );
            } else {
              const keyboard = {
                inline_keyboard: [[{ text: 'Send invitation', switch_inline_query: '' }]],
              };
          
              bot.sendMessage(chatId, 'Duel created, invite a friend:', {
                reply_markup: JSON.stringify(keyboard),
              });
          
              bot.sendMessage(
                chatId,
                'Your app url: ',
                Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
              );
            }
          }
          if (!createdDuel.isfinished && dateSec - createdDuel.creation >= duel_lifetime ) {
             FinishDuel(createdDuel.duel_id, "");
          }
        }

        bot.sendMessage(
          chatId,
          'Welcome! Enter duel command to play with friends',
          Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
        );
      } catch (e) {
        console.log('Start cmd exception: ', e.message);
        bot.sendMessage(
          chatId,
          'Bot-side error'
        );
      }
    };
  };

  bot.onText(/\/start/, startHandler(false));

  bot.onText(/\/start (.+)/, startHandler(true));

  bot.onText(/\/duel/, async (msg) => {
    const chatId = msg.chat.id;

    const linkAuthDataPrev: TelegramAuthData = {
      auth_date: GetDaylyAuthDate(),
      last_name: msg.from.last_name || '',
      first_name: msg.from.first_name,
      id: msg.from.id,
      username: msg.from.username || '',
      hash: '',
    };

    const authHash = CreateTelegramAuthHash(linkAuthDataPrev);
    const app_url = `${
      process.env.TELEGRAM_CLIENT_URL
    }?authHash=${authHash}&authDate=${GetDaylyAuthDate()}`;

    if (!msg.from.username) {
      bot.sendMessage(
        chatId,
        'You need to have a visible username to start a duel',
        Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
      );
      return;
    }

    const userLastDuel = await GetDuelDataByUser(msg.from.username);
    console.log('Last duel', userLastDuel);
    if (!userLastDuel) {
      await CreateDuel(msg.from.username, '');
    } else {
      const isFinished = userLastDuel.isfinished;
      const creation = Number(userLastDuel.creation);
      const dateSec = Math.round(new Date().getTime() / 1000);
      console.log("Duel dates: ", dateSec, creation, dateSec - creation, duel_lifetime);
      if (!isFinished && dateSec - creation < duel_lifetime && userLastDuel.login1 && userLastDuel.login2) {
        bot.sendMessage(
          chatId,
          'You already in duel',
          Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
        );
        return;
      }
      if (!isFinished && dateSec - creation >= duel_lifetime) {
        await FinishDuel(userLastDuel.duel_id, '');
        await CreateDuel(msg.from.username, '');
      }
    }

    const keyboard = {
      inline_keyboard: [[{ text: 'Send invitation', switch_inline_query: '' }]],
    };

    bot.sendMessage(chatId, 'Hello! Invite your friend to a duel:', {
      reply_markup: JSON.stringify(keyboard),
    });

    bot.sendMessage(
      chatId,
      'Your app url: ',
      Markup.keyboard([Markup.button.webApp('Start vorpal game', app_url)]),
    );
  });

  bot.on('inline_query', (query) => {
    const deepLink = `https://t.me/Wgl_starmaptest_bot?start=${query.from.username}`;

    const results = [
      {
        type: 'article',
        id: '1',
        title: 'Send invitation message',
        input_message_content: {
          message_text: `Duel call from ${query.from.first_name} ${query.from.last_name}`,
          parse_mode: 'Markdown',
        },
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Confirm invitation', url: deepLink }], //callback_data: metadataString
          ],
        },
      },
    ];

    bot.answerInlineQuery(query.id, results);
  });

  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });

  bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
  });

  bot.on('error', (error) => {
    console.error('Bot error:', error);
  });
}
