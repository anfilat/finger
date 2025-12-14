import englishWords from 'an-array-of-english-words/index.json';
import russianWords from 'russian-words/words.json';
import type { Language } from '../lib/keyboard.js';

// Массив английских слов
export const englishWordList: string[] = englishWords;

// Массив русских слов
export const russianWordList: string[] = russianWords;

/**
 * Получить случайное слово для указанного языка
 */
export function getRandomWord(language: Language): string {
  const words = language === 'english' ? englishWordList : russianWordList;
  return words[Math.floor(Math.random() * words.length)];
}


