<script>
    export let setupMode = true;

    function onToSetupMode() {
		setupMode = true;
    }

	function onFromSetupMode() {
		setupMode = false;
	}
</script>

<svelte:body on:click={onToSetupMode} />

{#if setupMode}
    <button on:click|stopPropagation={onFromSetupMode}>
        Start
    </button>
{/if}
