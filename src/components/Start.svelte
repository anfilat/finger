<script>
	import 'bulma/css/bulma.css'

	export let setupMode;
    export let setupOk;
</script>

<svelte:body on:click="{() => setupMode.set(true)}" />

{#if $setupMode}
    <button class="button is-primary is-large" on:click|stopPropagation="{() => setupMode.set(false)}" disabled={!$setupOk}>
        Start
    </button>
{/if}
