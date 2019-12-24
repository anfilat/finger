<script>
	import { onDestroy } from 'svelte';
	import { setupMode, trainingType, OneKeyTraining, RandomKeyTraining } from './data/app';
	import Start from './components/Start.svelte';
	import TrainingType from './components/TrainingType.svelte';
	import KeyPress from './components/KeyPress.svelte';
	import * as oneKey from './trainings/oneKey';
	import * as randomKey from './trainings/randomKey';

	let targetKey;
	let lastKey = '&nbsp;';
	let { setupOk, reset, getNextKey, setupComponent } = oneKey;

	onDestroy(setupMode.subscribe(value => {
		if (!value) {
			start();
		}
	}));

	onDestroy(trainingType.subscribe(value => {
		if (value == OneKeyTraining) {
			({ setupOk, reset, getNextKey, setupComponent } = oneKey);
		} else {
			({ setupOk, reset, getNextKey, setupComponent } = randomKey);
		}
	}));

	function start() {
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
	<Start {setupOk} {setupMode}/>

	{#if $setupMode}
		<TrainingType {OneKeyTraining} {RandomKeyTraining} {trainingType} />
		<svelte:component this={setupComponent} />
	{:else}
		<KeyPress on:key={onKey} />
		<div class="keys">
			<div class="targetKey">{targetKey}</div>
			<div class="lastKey">{@html lastKey}</div>
		</div>
	{/if}
</div>
