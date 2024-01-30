import { Telegraf, session } from 'telegraf';
import config from 'config';
import { openai } from "./openai.js";

console.log(config.get('TEST_ENV'));

const INITIAL_SESSION = {
    messages: [],
}
const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.use(session());

bot.command("new", async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего текстового сообщения.");
});

bot.command("start", async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего текстового сообщения.");
});

bot.on('text', async (ctx) => {
    ctx.session ??= INITIAL_SESSION;
    try {
        await ctx.reply("Подождите, пожалуйста, я думаю...");
        const text = ctx.message.text;
        ctx.session.messages.push({ role: 'user', content: text });
        // const messages = [{ role: 'user', content: text }];
        const response = await openai.chat(ctx.session.messages);
        
        ctx.session.messages.push({ role: 'system', content: response });

        // Теперь response напрямую содержит текст ответа
        if (response) {
            await ctx.reply(response);
        } else {
            await ctx.reply("Извините, я не смог обработать ваш запрос.");
            console.log(`Error: Incomplete response from OpenAI`);
        }
    } catch (e) {
        console.log(`Error:`, e.message);
        await ctx.reply("Произошла ошибка при обработке вашего запроса.");
    }
});

bot.command('start', async (ctx) =>
    await ctx.reply("Привет! Напишите что-нибудь, и я отвечу."),
);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));