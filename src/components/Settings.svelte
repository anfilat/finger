<script lang="ts">
  import { appStore, setLanguage, setTrainingType, addSelectedKey, removeLastSelectedKey, setActiveFile, removeFile, addFile } from '../stores/app.js';
  import type { TrainingType } from '../stores/app.js';
  import type { Language } from '../lib/keyboard.js';
  import { isValidKey } from '../lib/keyboard.js';
  import { processUploadedFile, saveFileLinesToStorage, saveFilesToStorage } from '../lib/fileManager.js';
  import { get } from 'svelte/store';

  let selectedKeysInput = '';
  let fileInput: HTMLInputElement;

  // Получаем текущее состояние из store
  $: state = $appStore;
  $: language = state.language;
  $: trainingType = state.trainingType;
  $: selectedKeys = state.selectedKeys;
  $: files = state.files;
  $: activeFileId = state.activeFileId;

  // Обработка ввода клавиш для режима Select Keys
  function handleKeyInput(event: KeyboardEvent) {
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

  // Проверка, можно ли запустить тренировку
  $: canStart = 
    trainingType === 'random-key' || 
    trainingType === 'phrases' ||
    (trainingType === 'select-keys' && selectedKeys.length > 0) ||
    (trainingType === 'files' && activeFileId !== null);
</script>

<div class="settings">
  <h2>Настройки</h2>

  <!-- Выбор языка -->
  <div class="setting-group">
    <label>Язык:</label>
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
    <label>Тип тренировки:</label>
    <div class="radio-group">
      <label>
        <input type="radio" name="training" value="select-keys" checked={trainingType === 'select-keys'} 
               onchange={() => setTrainingType('select-keys')} />
        Select Keys
      </label>
      <label>
        <input type="radio" name="training" value="random-key" checked={trainingType === 'random-key'} 
               onchange={() => setTrainingType('random-key')} />
        Random Key
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
      <label>Выбранные клавиши:</label>
      <div class="key-input-container">
        <input
          type="text"
          class="key-input"
          placeholder="Нажмите клавиши для добавления"
          value={selectedKeysInput}
          onkeydown={handleKeyInput}
          readonly
        />
        <div class="selected-keys-list">
          {#if selectedKeys.length > 0}
            {#each selectedKeys as key}
              <span class="key-badge">{key}</span>
            {/each}
          {:else}
            <span class="empty-message">Нет выбранных клавиш</span>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Настройки для Files -->
  {#if trainingType === 'files'}
    <div class="setting-group">
      <label>Загрузить файл:</label>
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

  <!-- Кнопка Start -->
  <div class="setting-group">
    <button class="start-button" disabled={!canStart} onclick={handleStart}>
      Start
    </button>
  </div>
</div>

<style>
  .settings {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .setting-group {
    margin-bottom: 1.5rem;
  }

  .setting-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .radio-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
    cursor: pointer;
  }

  .key-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .key-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
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
