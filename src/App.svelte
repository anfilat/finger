<script>
	import Start from './Start.svelte';

	let setupMode;
	let lastKey;

	function onKeyPress(event) {
		lastKey = event.key;
	}
</script>

<style>
	.main {
		min-height: 100vh;
	}

	.lastKey {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 64px;
		font-family: monospace;
	}
</style>

<svelte:body on:keypress={onKeyPress} />

<div class="main">
	<Start bind:setupMode />
	{#if !setupMode}
		<div class="lastKey">{lastKey}</div>
	{/if}
</div>
