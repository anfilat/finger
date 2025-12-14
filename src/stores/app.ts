import { writable } from 'svelte/store';
import type { Language } from '../lib/keyboard.js';

// Типы режимов
export type AppMode = 'settings' | 'arena';

// Типы тренировок
export type TrainingType = 'select-keys' | 'random-key' | 'phrases' | 'files';

// Информация о файле
export interface FileInfo {
  id: string; // хеш содержимого
  name: string;
  current: number; // сколько строк пройдено
  count: number; // сколько строк всего
}

// Глобальное состояние приложения
export interface AppState {
  mode: AppMode;
  language: Language;
  trainingType: TrainingType;
  // Настройки для Select Keys
  selectedKeys: string[];
  // Настройки для Files
  files: FileInfo[];
  activeFileId: string | null;
}

// Начальное состояние
const initialState: AppState = {
  mode: 'settings',
  language: 'english',
  trainingType: 'select-keys',
  selectedKeys: [],
  files: [],
  activeFileId: null
};

// Создаём writable store
export const appStore = writable<AppState>(initialState);

// Вспомогательные функции для работы со store

/**
 * Установить режим
 */
export function setMode(mode: AppMode) {
  appStore.update(state => ({ ...state, mode }));
}

/**
 * Установить язык
 */
export function setLanguage(language: Language) {
  appStore.update(state => ({
    ...state,
    language,
    selectedKeys: [] // Сбрасываем выбранные клавиши при смене языка
  }));
}

/**
 * Установить тип тренировки
 */
export function setTrainingType(trainingType: TrainingType) {
  appStore.update(state => ({ ...state, trainingType }));
}

/**
 * Добавить клавишу в список выбранных (Select Keys)
 */
export function addSelectedKey(key: string) {
  appStore.update(state => {
    const lowerKey = key.toLowerCase();
    if (!state.selectedKeys.includes(lowerKey)) {
      return {
        ...state,
        selectedKeys: [...state.selectedKeys, lowerKey]
      };
    }
    return state;
  });
}

/**
 * Удалить последнюю клавишу из списка выбранных (Select Keys)
 */
export function removeLastSelectedKey() {
  appStore.update(state => ({
    ...state,
    selectedKeys: state.selectedKeys.slice(0, -1)
  }));
}

/**
 * Добавить файл
 */
export function addFile(file: FileInfo) {
  appStore.update(state => {
    // Проверяем, нет ли уже файла с таким id
    if (state.files.some(f => f.id === file.id)) {
      return state;
    }
    return {
      ...state,
      files: [...state.files, file],
      activeFileId: file.id // Автоматически делаем новый файл активным
    };
  });
}

/**
 * Удалить файл
 */
export function removeFile(fileId: string) {
  appStore.update(state => {
    const newFiles = state.files.filter(f => f.id !== fileId);
    const newActiveFileId = state.activeFileId === fileId ? null : state.activeFileId;
    return {
      ...state,
      files: newFiles,
      activeFileId: newActiveFileId
    };
  });
}

/**
 * Установить активный файл
 */
export function setActiveFile(fileId: string | null) {
  appStore.update(state => ({ ...state, activeFileId: fileId }));
}

/**
 * Обновить прогресс файла
 */
export function updateFileProgress(fileId: string, current: number) {
  appStore.update(state => ({
    ...state,
    files: state.files.map(f =>
      f.id === fileId ? { ...f, current } : f
    )
  }));
}
