<script>
    export let setupMode = true;
    export let setupOk;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    function onToSetupMode() {
		setupMode = true;
    }

	function onFromSetupMode() {
		setupMode = false;
		dispatch('start');
	}
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

<svelte:body on:click={onToSetupMode} />

{#if setupMode}
    <button on:click|stopPropagation={onFromSetupMode} disabled={!setupOk}>
        Start
    </button>
{/if}
