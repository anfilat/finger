// Типы для руки
export type Hand = 'left' | 'right';

// Типы для языка
export type Language = 'english' | 'russian';


// Конфигурация раскладки
export interface LayoutConfig {
  language: Language;
  allKeys: string[]; // Упорядоченный список всех допустимых символов
  homeKeys: {
    left: string[]; // Базовые клавиши левой руки
    right: string[]; // Базовые клавиши правой руки
  };
  keyMap: Map<string, Hand | null>; // Привязка символа к руке (null для базовых)
}

// Английская раскладка QWERTY
const englishLayout: LayoutConfig = {
  language: 'english',
  homeKeys: {
    left: ['a', 's', 'd', 'f'],
    right: ['j', 'k', 'l', ';']
  },
  allKeys: [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd',
    'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+',
    '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"',
    ',', '<', '.', '>', '/', '?'
  ],
  keyMap: new Map([
    // Базовые клавиши (null) - не привязаны к рукам
    ['a', null], ['s', null], ['d', null], ['f', null],
    ['j', null], ['k', null], ['l', null], [';', null],
    // Левая рука
    ['q', 'left'], ['w', 'left'], ['e', 'left'], ['r', 'left'], ['t', 'left'], ['g', 'left'],
    ['z', 'left'], ['x', 'left'], ['c', 'left'], ['v', 'left'], ['b', 'left'],
    ['1', 'left'], ['2', 'left'], ['3', 'left'], ['4', 'left'], ['5', 'left'], ['6', 'left'],
    ['`', 'left'], ['~', 'left'],
    ['!', 'left'], ['@', 'left'], ['#', 'left'], ['$', 'left'], ['%', 'left'], ['^', 'left'],
    // Правая рука
    ['y', 'right'], ['u', 'right'], ['i', 'right'], ['o', 'right'], ['p', 'right'],
    ['h', 'right'], ['n', 'right'], ['m', 'right'],
    ['7', 'right'], ['8', 'right'], ['9', 'right'], ['0', 'right'],
    ['&', 'right'], ['*', 'right'], ['(', 'right'], [')', 'right'],
    ['-', 'right'], ['_', 'right'], ['=', 'right'], ['+', 'right'],
    ['[', 'right'], ['{', 'right'], [']', 'right'], ['}', 'right'], ['\\', 'right'], ['|', 'right'],
    [':', 'right'], ["'", 'right'], ['"', 'right'],
    [',', 'right'], ['<', 'right'], ['.', 'right'], ['>', 'right'], ['/', 'right'], ['?', 'right']
  ])
};

// Русская раскладка ЙЦУКЕН
const russianLayout: LayoutConfig = {
  language: 'russian',
  homeKeys: {
    left: ['ф', 'ы', 'в', 'а'],
    right: ['о', 'л', 'д', 'ж']
  },
  allKeys: [
    'ё', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '-', '_', '=', '+',
    '\\','/', ',', '.',
  ],
  keyMap: new Map([
    // Базовые клавиши (null) - не привязаны к рукам
    ['ф', null], ['ы', null], ['в', null], ['а', null],
    ['о', null], ['л', null], ['д', null], ['ж', null],
    // Левая рука
    ['ё', 'left'], ['й', 'left'], ['ц', 'left'], ['у', 'left'], ['к', 'left'], ['е', 'left'],
    ['п', 'left'], ['я', 'left'], ['ч', 'left'], ['с', 'left'], ['м', 'left'], ['и', 'left'],
    ['1', 'left'], ['2', 'left'], ['3', 'left'], ['4', 'left'], ['5', 'left'], ['6', 'left'],
    ['!', 'left'], ['"', 'left'], ['№', 'left'], [';', 'left'], ['%', 'left'], [':', 'left'],
    // Правая рука
    ['н', 'right'], ['г', 'right'], ['ш', 'right'], ['щ', 'right'], ['з', 'right'],
    ['х', 'right'], ['ъ', 'right'], ['р', 'right'], ['э', 'right'],
    ['т', 'right'], ['ь', 'right'], ['б', 'right'], ['ю', 'right'],
    ['7', 'right'], ['8', 'right'], ['9', 'right'], ['0', 'right'],
    ['?', 'right'], ['*', 'right'], ['(', 'right'], [')', 'right'],
    ['-', 'right'], ['_', 'right'], ['=', 'right'], ['+', 'right'],
    ['\\', 'right'], ['/', 'right'], [',', 'right'], ['.', 'right']
  ])
};

// Словарь раскладок
const layouts: Map<Language, LayoutConfig> = new Map([
  ['english', englishLayout],
  ['russian', russianLayout]
]);

/**
 * Получить случайный допустимый символ для языка
 */
export function getRandomKey(language: Language): string {
  const keys = getAllKeys(language);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Получить все допустимые символы для языка
 */
export function getAllKeys(language: Language): string[] {
  const layout = getLayout(language);
  return [...layout.allKeys];
}

/**
 * Получить случайную базовую клавишу для руки
 */
export function getRandomHomeKey(hand: Hand, language: Language): string {
  const keys = getHomeKeysForHand(hand, language);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Получить все базовые клавиши для руки
 */
export function getHomeKeysForHand(hand: Hand, language: Language): string[] {
  const layout = getLayout(language);
  return layout.homeKeys[hand];
}


/**
 * Получить руку для символа (null для базовых клавиш)
 */
export function getHandForKey(char: string, language: Language): Hand | null {
  const layout = getLayout(language);
  return layout.keyMap.get(char) ?? null;
}

/**
 * Проверить, является ли символ допустимым для языка
 */
export function isValidKey(char: string, language: Language): boolean {
  const layout = getLayout(language);
  return layout.allKeys.includes(char);
}

/**
 * Получить конфигурацию раскладки для языка
 */
export function getLayout(language: Language): LayoutConfig {
  const layout = layouts.get(language);
  if (!layout) {
    throw new Error(`Layout not found for language: ${language}`);
  }
  return layout;
}
