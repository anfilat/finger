<script>
	import Start from './Start.svelte';
	import KeyPress from './KeyPress.svelte';
	import * as oneKey from './oneKey';

	let setupMode;
	let targetKey;
	let lastKey = '&nbsp;';
	const { setupOk, reset, getNextKey, setupComponent } = oneKey;

	function onStart() {
		reset();
		next();
	}

	function onKey(event) {
		const key = event.detail.toLowerCase();

		lastKey = key;

		setTimeout(() => {
			if (key == targetKey) {
				next();
			}
		}, 10);
	}

	function next() {
		targetKey = getNextKey();
		lastKey = '&nbsp;';
	}
</script>

<style>
	.main {
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
	}

	.keys {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 64px;
		font-family: monospace;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="main">
	<Start bind:setupMode on:start={onStart} setupOk={$setupOk} />

	{#if setupMode}
		<svelte:component this={setupComponent} />
	{:else}
		<KeyPress on:key={onKey} />
		<div class="keys">
			<div class="targetKey">{targetKey}</div>
			<div class="lastKey">{@html lastKey}</div>
		</div>
	{/if}
</div>
