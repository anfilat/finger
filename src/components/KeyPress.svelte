<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onKeyDown(event) {
		dispatch('key', event.key);
	}
</script>

<svelte:body on:keydown={onKeyDown}/>
