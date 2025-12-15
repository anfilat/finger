<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { appStore, setMode, updateFileProgress } from '../stores/app.js';
  import {
    SelectKeysGenerator,
    RandomKeyGenerator,
    PhrasesGenerator,
    FilesGenerator
  } from '../lib/trainingGenerators.js';
  import { replaceWhitespace, findFirstError } from '../lib/utils.js';
  import { saveFilesToStorage } from '../lib/fileManager.js';
  import { get } from 'svelte/store';

  let target = $state('');
  let entered = $state('');
  let followUp = $state<string | null>(null);
  let generator = $state<SelectKeysGenerator | RandomKeyGenerator | PhrasesGenerator | FilesGenerator | null>(null);

  const storeState = $derived($appStore);
  const language = $derived(storeState.language);
  const trainingType = $derived(storeState.trainingType);

  // Инициализация генератора
  function initGenerator() {
    entered = '';
    followUp = null;

    switch (trainingType) {
      case 'select-keys':
        generator = new SelectKeysGenerator(storeState.selectedKeys, language);
        break;
      case 'random-key':
        generator = new RandomKeyGenerator(language);
        break;
      case 'phrases':
        generator = new PhrasesGenerator(language);
        break;
      case 'files':
        const activeFile = storeState.files.find(f => f.id === storeState.activeFileId);
        generator = new FilesGenerator(activeFile || null, language);
        break;
    }

    loadNextTarget();
  }

  // Загрузить следующую цель
  function loadNextTarget() {
    if (!generator) return;

    // Если есть followUp, используем его
    if (followUp !== null) {
      target = followUp;
      followUp = null;
    } else {
      // Иначе генерируем новую цель
      const [current, nextFollowUp] = generator.generate();
      target = current;
      followUp = nextFollowUp;
    }

    entered = '';
  }

  // Обработка ввода символа
  function handleKeyPress(event: KeyboardEvent) {
    // Игнорируем специальные клавиши
    if (event.key.length > 1) {
      return;
    }

    // Добавляем символ к буферу
    entered += event.key;
    event.preventDefault();

    // Для режимов select-keys и random-key добавляем задержку,
    // чтобы пользователь увидел введенный символ
    if (trainingType === 'select-keys' || trainingType === 'random-key') {
      setTimeout(() => {
        checkMatch();
      }, 100);
    } else {
      // Для других режимов проверка мгновенная
      checkMatch();
    }
  }

  // Обработка Backspace
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (entered.length > 0) {
        entered = entered.slice(0, -1);
        event.preventDefault();
      }
    }
  }

  // Проверка совпадения
  function checkMatch() {
    if (entered === target) {
      // Обновляем прогресс для режима Files
      if (trainingType === 'files' && generator instanceof FilesGenerator) {
        const currentPos = generator.getCurrentPosition();
        const newPos = currentPos + 1;
        const activeFile = storeState.files.find(f => f.id === storeState.activeFileId);

        if (activeFile) {
          updateFileProgress(activeFile.id, newPos);
          const updatedState = get(appStore);
          saveFilesToStorage(updatedState.files);

          // Обновляем генератор с новым прогрессом
          const updatedFile = updatedState.files.find(f => f.id === activeFile.id);
          if (updatedFile && generator instanceof FilesGenerator) {
            generator.updateFileInfo(updatedFile);
          }
        }
      }

      // Загружаем следующую цель
      loadNextTarget();
    }
  }

  // Обработка клика для возврата в настройки
  function handleClick() {
    setMode('settings');
  }

  // Реакция на изменение режима, типа тренировки или языка
  let prevMode: string | null = null;
  let prevTrainingType: string | null = null;
  let prevLanguage: string | null = null;

  $effect(() => {
    if (storeState.mode === 'arena' &&
         (prevMode !== storeState.mode ||
          prevTrainingType !== storeState.trainingType ||
          prevLanguage !== storeState.language)) {
      prevMode = storeState.mode;
      prevTrainingType = storeState.trainingType;
      prevLanguage = storeState.language;
      initGenerator();
    }
  });

  // Настройка обработчиков событий
  onMount(() => {
    if (storeState.mode === 'arena') {
      initGenerator();
    }

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    document.removeEventListener('keypress', handleKeyPress);
    document.removeEventListener('keydown', handleKeyDown);
  });

  // Вычисление отображаемого текста
  const displayedEntered = $derived(entered.length > 0 ? replaceWhitespace(entered) : '\u00A0'); // неразрывный пробел
  const errorIndex = $derived(findFirstError(target, entered));
  const hasError = $derived(errorIndex >= 0);
  const correctPart = $derived(hasError ? displayedEntered.slice(0, errorIndex) : displayedEntered);
  const errorPart = $derived(hasError ? displayedEntered.slice(errorIndex) : '');

  // Адаптивный размер шрифта для длинных строк
  const isLongLine = $derived(target.length > 50);
</script>

{#if storeState.mode === 'arena'}
  <div class="arena" onclick={handleClick}>
    <div class="arena-content" class:long-line={isLongLine}>
      <!-- Верхняя строка: целевая последовательность -->
      <div class="target-line">{target}</div>

      <!-- Нижняя строка: введённая последовательность -->
      <div class="entered-line">
        {correctPart}<span class="error">{errorPart}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .arena {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arena-content {
    max-width: 90%;
    text-align: center;
    font-family: 'Courier New', monospace;
    font-size: 64px;
  }

  .arena-content.long-line {
    font-size: 1.2rem;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .target-line {
    color: #333;
  }

  .entered-line {
    color: #444;
  }

  .error {
    color: #d32f2f;
  }
</style>
