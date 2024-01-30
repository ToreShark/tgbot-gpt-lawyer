import { OpenAI } from 'openai';
import config from "config";

class OpenAi {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY,
        });
    }

    async chat(messages) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages
            });

            // Проверка наличия ответа
            if (!response || !response.choices || response.choices.length === 0) {
                return null;
            }

            // Извлечение и возвращение текста ответа
            const messageContent = response.choices[0].message.content;
            return messageContent;
        }
        catch (e) {
            console.log(`Error while chat:`, e.message);
            return null;
        }
    }
}
export const openai = new OpenAi(config.get('OPENAI_KEY'));

(async () => {
    const messages = [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "Tell me a joke." }
    ];

    const response = await openai.chat(messages);
    console.log(response);
})();
