<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onKeyPress(event) {
		dispatch('key', event.key);
	}
</script>

<svelte:body on:keypress={onKeyPress} />
