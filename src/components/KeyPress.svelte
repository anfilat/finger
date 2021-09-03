<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    function onKeypress(event) {
        dispatch('key', event.key);
    }

    function onKeyDown(event) {
        if (event.key.toLowerCase() === 'backspace') {
            dispatch('backspace');
        }
    }
</script>

<svelte:body
    on:keypress={onKeypress}
    on:keydown={onKeyDown}
/>
