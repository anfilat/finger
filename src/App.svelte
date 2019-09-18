<script>
	import Start from './Start.svelte';
	import KeyPress from './KeyPress.svelte';
	import OneKeySetup from './OneKeySetup.svelte';
	import { setupOk, getNextKey } from './oneKey';

	let setupMode;
	let targetKey;
	let lastKey = '&nbsp;';

	function onStart() {
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
		<OneKeySetup/>
	{:else}
		<KeyPress on:key={onKey} />
		<div class="keys">
			<div class="targetKey">{targetKey}</div>
			<div class="lastKey">{@html lastKey}</div>
		</div>
	{/if}
</div>
