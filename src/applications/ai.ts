import axios from 'axios';
import { OpenAI } from 'openai';
import { gpt3dot5 } from '@/config';

const openai = new OpenAI({
  apiKey: gpt3dot5.apiKey,
  baseURL: 'https://api.chatanywhere.com.cn/v1',
});

export const simpleAI = async (prompt: string) => {
  type Res = { result: 0 | (number & {}); content: string; };
  const res = await axios.get<Res>(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${prompt}`);
  return res.data.content;
};

export const gptAI = (prompt: string, opts?: {
  /** 控制生成文本的创造性，值越高则越随机 */
  temperature?: number;
  /** ms */
  timeout?: number;
}) => openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  temperature: opts?.temperature ?? 0.7,
  messages: [{ role: 'user', content: prompt }],
}, {
  timeout: opts?.timeout ?? 5 * 1000,
});

export const gptAIStream = (prompt: string, opts?: {
  /** 控制生成文本的创造性，值越高则越随机 */
  temperature?: number;
  /** ms */
  timeout?: number;
}) => openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  temperature: opts?.temperature ?? 0.7,
  messages: [{ role: 'user', content: prompt }],
  stream: true,
}, {
  timeout: opts?.timeout ?? 5 * 1000,
});

export type AIType = 'simple-ai' | 'gpt';

export const getAIAnswer = async ({
  aiType,
  prompt,
}: {
  aiType: AIType;
  prompt: string;
}): Promise<string | null> => {
  switch (aiType) {
    case 'simple-ai':
      return await simpleAI(prompt);
    case 'gpt':
      return (await gptAI(prompt)).choices[0].message.content;
  }
};
