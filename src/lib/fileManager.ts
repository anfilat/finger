import type { Language } from './keyboard.js';
import { isValidKey } from './keyboard.js';
import type { FileInfo } from '../stores/app.js';

// Ключи для localStorage
const STORAGE_KEY_FILES = 'finger_typing_files';
const STORAGE_KEY_LINES = 'finger_typing_file_lines';

// Интерфейс для сохранения очищенных строк файла
interface FileLines {
  fileId: string;
  lines: string[];
}

/**
 * Обработать загруженный файл: прочитать, обработать текст, вычислить хеш
 */
export async function processUploadedFile(
  file: File,
  language: Language
): Promise<{ fileId: string; lines: string[]; fileInfo: FileInfo }> {
  // Читаем файл
  const content = await readTextFile(file);
  
  // Вычисляем хеш
  const fileId = await hashFileContent(content);
  
  // Обрабатываем текст
  const lines = processFileText(content, language);
  
  // Создаём информацию о файле
  const fileInfo: FileInfo = {
    id: fileId,
    name: file.name,
    current: 0,
    count: lines.length
  };
  
  return { fileId, lines, fileInfo };
}

/**
 * Вычислить хеш содержимого файла (SHA-256)
 */
export async function hashFileContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Прочитать текстовый файл
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Обработать текст файла: фильтрация символов и нормализация пробелов
 */
export function processFileText(text: string, language: Language): string[] {
  const lines = text.split(/\r?\n/);
  const processedLines: string[] = [];

  for (const line of lines) {
    // Заменяем недопустимые символы на пробелы
    let processedLine = '';
    for (const char of line) {
      const lowerChar = char.toLowerCase();
      if (isValidKey(lowerChar, language) || char === ' ') {
        processedLine += char;
      } else {
        processedLine += ' ';
      }
    }

    // Нормализация пробелов: множественные пробелы -> один пробел
    processedLine = processedLine.replace(/\s+/g, ' ');

    // Обрезка пробелов по краям
    processedLine = processedLine.trim();

    // Добавляем только непустые строки
    if (processedLine.length > 0) {
      processedLines.push(processedLine);
    }
  }

  return processedLines;
}

/**
 * Сохранить список файлов в localStorage
 */
export function saveFilesToStorage(files: FileInfo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  } catch (error) {
    console.error('Failed to save files to localStorage:', error);
  }
}

/**
 * Загрузить список файлов из localStorage
 */
export function loadFilesFromStorage(): FileInfo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FILES);
    if (data) {
      return JSON.parse(data) as FileInfo[];
    }
  } catch (error) {
    console.error('Failed to load files from localStorage:', error);
  }
  return [];
}

/**
 * Сохранить очищенные строки файла в localStorage
 */
export function saveFileLinesToStorage(fileId: string, lines: string[]): void {
  try {
    const allLines = loadAllFileLinesFromStorage();
    const existingIndex = allLines.findIndex(fl => fl.fileId === fileId);
    
    const fileLines: FileLines = { fileId, lines };
    
    if (existingIndex >= 0) {
      allLines[existingIndex] = fileLines;
    } else {
      allLines.push(fileLines);
    }
    
    localStorage.setItem(STORAGE_KEY_LINES, JSON.stringify(allLines));
  } catch (error) {
    console.error('Failed to save file lines to localStorage:', error);
  }
}

/**
 * Загрузить очищенные строки файла из localStorage
 */
export function loadFileLinesFromStorage(fileId: string): string[] | null {
  try {
    const allLines = loadAllFileLinesFromStorage();
    const fileLines = allLines.find(fl => fl.fileId === fileId);
    return fileLines ? fileLines.lines : null;
  } catch (error) {
    console.error('Failed to load file lines from localStorage:', error);
    return null;
  }
}

/**
 * Удалить строки файла из localStorage
 */
export function removeFileLinesFromStorage(fileId: string): void {
  try {
    const allLines = loadAllFileLinesFromStorage();
    const filtered = allLines.filter(fl => fl.fileId !== fileId);
    localStorage.setItem(STORAGE_KEY_LINES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove file lines from localStorage:', error);
  }
}

/**
 * Загрузить все сохранённые строки файлов из localStorage
 */
function loadAllFileLinesFromStorage(): FileLines[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LINES);
    if (data) {
      return JSON.parse(data) as FileLines[];
    }
  } catch (error) {
    console.error('Failed to load file lines from localStorage:', error);
  }
  return [];
}
