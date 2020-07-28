<script>
	import { setupMode } from './store';

	export let setupOk;

	let disabled;
	$: disabled = !$setupOk;
</script>

<style>
    button {
        background-color: #00d1b2;
        color: #fff;
        font-size: 24px;
        padding: 12px 24px;
        cursor: pointer;
        border-color: transparent;
        border-radius: 4px;
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button:hover {
        background-color: #00c4a7;
    }
</style>

<svelte:body on:click="{() => setupMode.set(true)}"/>

{#if $setupMode}
    <button
            on:click|stopPropagation="{() => setupMode.set(false)}"
            class="block"
            {disabled}
    >
        Start
    </button>
{/if}
