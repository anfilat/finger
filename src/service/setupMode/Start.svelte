<script>
	import 'bulma/css/bulma.css'
	import { setupMode } from './index';
	export let setupOk;
</script>

<svelte:body on:click="{() => setupMode.set(true)}"/>

{#if $setupMode}
	<button
			class="button is-primary is-large block"
			on:click|stopPropagation="{() => setupMode.set(false)}"
			disabled={!$setupOk}
	>
		Start
	</button>
{/if}
