import type { Language } from './keyboard.js';
import {
  getRandomKey,
  getHandForKey,
  getRandomHomeKey
} from './keyboard.js';
import { getRandomWord } from '../data/dictionaries.js';
import { loadFileLinesFromStorage } from './fileManager.js';
import type { FileInfo } from '../stores/app.js';

// Тип результата генератора: [current, followUp]
export type GeneratorResult = [string, string | null];

// Знаки препинания для режима Phrases
const PUNCTUATION_MARKS = ['.', ',', '?', '!', ':', ';', '-'];

/**
 * Генератор для режима Select Keys
 */
export class SelectKeysGenerator {
  private selectedKeys: string[];
  private language: Language;

  constructor(selectedKeys: string[], language: Language) {
    this.selectedKeys = selectedKeys;
    this.language = language;
  }

  /**
   * Сгенерировать следующую цель
   */
  generate(): GeneratorResult {
    if (this.selectedKeys.length === 0) {
      return ['', null];
    }

    // Выбираем случайный символ из списка
    const randomIndex = Math.floor(Math.random() * this.selectedKeys.length);
    const current = this.selectedKeys[randomIndex];

    // Определяем followUp: если у символа есть "домашняя" рука, выбираем базовую клавишу
    const hand = getHandForKey(current, this.language);
    const followUp = hand ? getRandomHomeKey(hand, this.language) : null;

    return [current, followUp];
  }
}

/**
 * Генератор для режима Random Key
 */
export class RandomKeyGenerator {
  private language: Language;

  constructor(language: Language) {
    this.language = language;
  }

  /**
   * Сгенерировать следующую цель
   */
  generate(): GeneratorResult {
    // Выбираем случайный символ из всех допустимых
    const current = getRandomKey(this.language);

    // Определяем followUp: если у символа есть "домашняя" рука, выбираем базовую клавишу
    const hand = getHandForKey(current, this.language);
    const followUp = hand ? getRandomHomeKey(hand, this.language) : null;

    return [current, followUp];
  }
}

/**
 * Генератор для режима Phrases
 */
export class PhrasesGenerator {
  private language: Language;

  constructor(language: Language) {
    this.language = language;
  }

  /**
   * Сгенерировать следующую цель
   */
  generate(): GeneratorResult {
    // Получаем два случайных слова
    const word1 = getRandomWord(this.language);
    const word2 = getRandomWord(this.language);

    // Капитализируем первое слово (первая буква заглавная)
    const capitalizedWord1 = word1.charAt(0).toUpperCase() + word1.slice(1).toLowerCase();

    // Выбираем случайный знак препинания
    const punctuation = PUNCTUATION_MARKS[Math.floor(Math.random() * PUNCTUATION_MARKS.length)];

    // Формируем итоговую строку: word1 + ' ' + word2 + punctuation
    const current = `${capitalizedWord1} ${word2}${punctuation}`;

    // Для Phrases followUp всегда null
    return [current, null];
  }
}

/**
 * Генератор для режима Files
 */
export class FilesGenerator {
  private fileInfo: FileInfo | null;
  private language: Language;
  private lines: string[] | null = null;

  constructor(fileInfo: FileInfo | null, language: Language) {
    this.fileInfo = fileInfo;
    this.language = language;
    this.loadLines();
  }

  /**
   * Загрузить строки файла из localStorage
   */
  private loadLines(): void {
    if (this.fileInfo) {
      this.lines = loadFileLinesFromStorage(this.fileInfo.id);
    } else {
      this.lines = null;
    }
  }

  /**
   * Сгенерировать следующую цель
   */
  generate(): GeneratorResult {
    if (!this.fileInfo || !this.lines) {
      return ['', null];
    }

    const { current, count } = this.fileInfo;

    // Если достигнут конец файла, возвращаем пустую строку
    if (current >= count) {
      return ['', null];
    }

    // Возвращаем строку по текущему индексу
    const currentLine = this.lines[current];
    return [currentLine, null];
  }

  /**
   * Обновить информацию о файле
   */
  updateFileInfo(fileInfo: FileInfo | null): void {
    this.fileInfo = fileInfo;
    this.loadLines();
  }

  /**
   * Получить текущую позицию в файле
   */
  getCurrentPosition(): number {
    return this.fileInfo?.current ?? 0;
  }
}
