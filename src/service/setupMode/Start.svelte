<script>
	import 'bulma/css/bulma.css'
	import { setupMode } from './store';

	export let setupOk;

	let disabled;
	$: disabled = !$setupOk;
</script>

<svelte:body on:click="{() => setupMode.set(true)}"/>

{#if $setupMode}
	<button
			class="button is-primary is-large block"
			on:click|stopPropagation="{() => setupMode.set(false)}"
			{disabled}
	>
		Start
	</button>
{/if}
