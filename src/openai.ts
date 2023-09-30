import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: "sk-TG4ZoUUcJYb5RSIWk0xzP66SHdPoJlyAMpmq5pa5o9G0ev4A",
  baseURL: 'https://api.chatanywhere.com.cn/v1',
});

export default openai;
