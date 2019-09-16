<script>
	let lastKey;

	function onKeyPress(event) {
		lastKey = event.key;
	}

	function onClick() {
		//console.log('click');
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

<div class="main" on:click={onClick}>
	{#if lastKey}
		<div class="lastKey">{lastKey}</div>
	{/if}
</div>
