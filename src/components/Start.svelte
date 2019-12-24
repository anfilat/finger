<script>
	export let setupMode;
    export let setupOk;
</script>

<style>
    button {
        font-size: 24px;
        padding: 8px 20px;
        border-radius: 4px;
    }

	button[disabled] {
        color: #AAA;
    }
</style>

<svelte:body on:click="{() => setupMode.set(true)}" />

{#if $setupMode}
    <button on:click|stopPropagation="{() => setupMode.set(false)}" disabled={!$setupOk}>
        Start
    </button>
{/if}
