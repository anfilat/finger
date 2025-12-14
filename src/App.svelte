<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from './stores/app.js';
  import Settings from './components/Settings.svelte';
  import Arena from './components/Arena.svelte';
  import { loadFilesFromStorage, loadFileLinesFromStorage } from './lib/fileManager.js';

  // Инициализация состояния из localStorage при загрузке
  onMount(() => {
    // Загружаем список файлов из localStorage
    const files = loadFilesFromStorage();

    // Загружаем строки для каждого файла
    files.forEach(file => {
      const lines = loadFileLinesFromStorage(file.id);
      if (lines) {
        // Обновляем информацию о файле с количеством строк
        file.count = lines.length;
      }
    });

    // Обновляем состояние приложения
    appStore.update(state => ({
      ...state,
      files: files,
      activeFileId: files.length > 0 ? files[0].id : null
    }));
  });
</script>

<main>
  {#if $appStore.mode === 'settings'}
    <Settings />
  {:else if $appStore.mode === 'arena'}
    <Arena />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    color: #111;
    background-color: #f5f5f5;
    font-size: 16px;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
  }
</style>
