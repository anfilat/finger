<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { appStore, setLanguage, setTrainingType, addSelectedKey, removeLastSelectedKey, setActiveFile, removeFile, addFile } from '../stores/app.js';
  import type { TrainingType } from '../stores/app.js';
  import type { Language } from '../lib/keyboard.js';
  import { isValidKey } from '../lib/keyboard.js';
  import { processUploadedFile, saveFileLinesToStorage, saveFilesToStorage } from '../lib/fileManager.js';
  import { get } from 'svelte/store';

  let fileInput: HTMLInputElement;

  // Получаем текущее состояние из store
  $: state = $appStore;
  $: language = state.language;
  $: trainingType = state.trainingType;
  $: selectedKeys = state.selectedKeys;
  $: files = state.files;
  $: activeFileId = state.activeFileId;


  // Обработка загрузки файла
  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) {
      return;
    }

    try {
      // Обрабатываем файл
      const { fileId, lines, fileInfo } = await processUploadedFile(file, language);
      
      // Сохраняем строки в localStorage
      saveFileLinesToStorage(fileId, lines);
      
      // Добавляем файл в store
      addFile(fileInfo);
      
      // Сохраняем список файлов в localStorage
      const updatedState = get(appStore);
      saveFilesToStorage(updatedState.files);
      
      // Очищаем input
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Failed to process file:', error);
      alert('Ошибка при загрузке файла');
    }
  }

  // Удаление файла
  function handleRemoveFile(fileId: string) {
    removeFile(fileId);
    const updatedState = get(appStore);
    saveFilesToStorage(updatedState.files);
  }

  // Выбор активного файла
  function handleSelectFile(fileId: string) {
    setActiveFile(fileId);
  }

  // Запуск тренировки
  function handleStart() {
    appStore.update(state => ({ ...state, mode: 'arena' }));
  }

  // Обработка ввода клавиш для режима Select Keys (глобально)
  function handleGlobalKeyInput(event: KeyboardEvent) {
    // Только для режима select-keys
    if (trainingType !== 'select-keys') {
      return;
    }

    if (event.key === 'Backspace') {
      removeLastSelectedKey();
      event.preventDefault();
      return;
    }

    // Игнорируем специальные клавиши
    if (event.key.length > 1) {
      return;
    }

    const char = event.key.toLowerCase();

    // Проверяем, допустим ли символ для текущего языка
    if (isValidKey(char, language)) {
      addSelectedKey(char);
    }

    event.preventDefault();
  }

  // Настройка глобальных обработчиков событий
  onMount(() => {
    document.addEventListener('keydown', handleGlobalKeyInput);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleGlobalKeyInput);
  });

  // Проверка, можно ли запустить тренировку
  $: canStart =
    trainingType === 'random-key' ||
    trainingType === 'phrases' ||
    (trainingType === 'select-keys' && selectedKeys.length > 0) ||
    (trainingType === 'files' && activeFileId !== null);
</script>

<div class="settings">
  <!-- Кнопка Start -->
  <div class="setting-group">
    <button class="start-button" disabled={!canStart} onclick={handleStart}>
      Start
    </button>
  </div>

  <!-- Выбор языка -->
  <div class="setting-group">
    <div class="group-label">Select language</div>
    <div class="radio-group">
      <label>
        <input type="radio" name="language" value="english" checked={language === 'english'} 
               onchange={() => setLanguage('english')} />
        English
      </label>
      <label>
        <input type="radio" name="language" value="russian" checked={language === 'russian'} 
               onchange={() => setLanguage('russian')} />
        Russian
      </label>
    </div>
  </div>

  <!-- Выбор типа тренировки -->
  <div class="setting-group">
    <div class="group-label">Select training</div>
    <div class="radio-group">
      <label>
        <input type="radio" name="training" value="select-keys" checked={trainingType === 'select-keys'} 
               onchange={() => setTrainingType('select-keys')} />
        Select Keys
      </label>
      <label>
        <input type="radio" name="training" value="random-key" checked={trainingType === 'random-key'} 
               onchange={() => setTrainingType('random-key')} />
        Random Keys
      </label>
      <label>
        <input type="radio" name="training" value="phrases" checked={trainingType === 'phrases'} 
               onchange={() => setTrainingType('phrases')} />
        Phrases
      </label>
      <label>
        <input type="radio" name="training" value="files" checked={trainingType === 'files'} 
               onchange={() => setTrainingType('files')} />
        Files
      </label>
    </div>
  </div>

  <!-- Настройки для Select Keys -->
  {#if trainingType === 'select-keys'}
    <div class="setting-group">
      <div class="group-label">Press training keys</div>
      <div class="selected-keys-list">
        {#if selectedKeys.length > 0}
          {#each selectedKeys as key}
            <span class="key-badge">{key}</span>
          {/each}
        {:else}
          <span class="empty-message">No keys selected. Press any key to add it.</span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Настройки для Files -->
  {#if trainingType === 'files'}
    <div class="setting-group">
      <div class="group-label">Загрузить файл:</div>
      <input
        type="file"
        accept=".txt"
        bind:this={fileInput}
        onchange={handleFileUpload}
      />
      
      {#if files.length > 0}
        <div class="files-list">
          <label>Загруженные файлы:</label>
          {#each files as file}
            <div class="file-item" class:active={file.id === activeFileId}>
              <button
                class="file-select"
                onclick={() => handleSelectFile(file.id)}
              >
                {file.name} - {file.current}/{file.count}
              </button>
              <button
                class="file-delete"
                onclick={() => handleRemoveFile(file.id)}
              >
                del
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .settings {
    padding-top: 20px;
    text-align: center;
  }

  .setting-group {
    margin-bottom: 24px;
  }

  .group-label {
    margin-bottom: 24px;
  }

  .radio-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: normal;
    cursor: pointer;
  }

    .radio-group input {
      margin: 0;
    }

  .selected-keys-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-height: 2rem;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .key-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #e3f2fd;
    border: 1px solid #90caf9;
    border-radius: 4px;
    font-family: monospace;
  }

  .empty-message {
    color: #999;
    font-style: italic;
  }

  .files-list {
    margin-top: 1rem;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .file-item.active {
    background-color: #e3f2fd;
    border-color: #90caf9;
  }

  .file-select {
    flex: 1;
    text-align: left;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .file-select:hover {
    text-decoration: underline;
  }

  .file-delete {
    padding: 0.25rem 0.5rem;
    background-color: #ffebee;
    border: 1px solid #ef5350;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    color: #c62828;
  }

  .file-delete:hover {
    background-color: #ffcdd2;
  }

  .start-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .start-button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .start-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
