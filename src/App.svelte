<script>
	import { onDestroy } from 'svelte';
	import 'bulma/css/bulma.css'
	import { setupMode, trainingType, OneKeyTraining, RandomKeyTraining } from './data/app';
	import { isKey } from './data/keys';
	import Start from './components/Start.svelte';
	import TrainingType from './components/TrainingType.svelte';
	import KeyPress from './components/KeyPress.svelte';
	import * as oneKey from './trainings/selectKeys';
	import * as randomKey from './trainings/randomKeys';

	let targetKey;
	let lastKeys = '';
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
		const key = event.detail;

		if (key === 'backspace') {
			lastKeys = lastKeys.slice(0, -1);
			return;
		}

		if (!isKey(key)) {
			return;
		}

		lastKeys += key;

		setTimeout(() => {
			if (lastKeys == targetKey) {
				next();
			}
		}, 10);
	}

	function next() {
		targetKey = getNextKey();
		lastKeys = '';
	}
</script>

<style>
	.main {
		padding: 20px;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.keys {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 64px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.lastKeys {
		display: flex;
	}
</style>

<div class="hero is-fullheight main">
	<div class="container main-container">
		<Start {setupOk} {setupMode}/>

		{#if $setupMode}
			<TrainingType {OneKeyTraining} {RandomKeyTraining} {trainingType} />
			<svelte:component this={setupComponent} />
		{:else}
			<KeyPress on:key={onKey} />
			<div class="keys is-family-monospace">
				<div>{targetKey}</div>
				<div class="lastKeys">
					<div>&nbsp</div>
					{@html lastKeys}
					<div>&nbsp</div>
				</div>
			</div>
		{/if}
	</div>
</div>
