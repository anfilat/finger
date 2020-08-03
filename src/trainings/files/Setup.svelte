<script>
    import {currentFile, files} from './store';

    function readFile(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            files.add(file.name, event.target.result);
        };
        reader.readAsText(file);
    }

    function removeFile(id) {
        files.delete(id);
    }

    function selectFile(id) {
        currentFile.set(id);
    }
</script>

<style>
    input[type="file"] {
        display: none;
    }

    .file-upload {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 12px 24px;
        cursor: pointer;
        margin-bottom: 12px;
    }

    .item {
        cursor: pointer;
        margin-bottom: 12px;
    }

    .item.current {
        color: #336;
    }

    .delete-item {
        border-radius: 4px;
        cursor: pointer;
    }
</style>

<label class="file-upload">
    <input type="file" on:change={readFile}>
    Load file
</label>
{#each $files as item (item.id)}
    <div class="item" class:current={$currentFile === item.id} on:click={() => selectFile(item.id)}>
        {`${item.name} - ${item.current}/${item.count}`}
        <button class="delete-item" on:click|stopPropagation={() => removeFile(item.id)}>
            del
        </button>
    </div>
{/each}
