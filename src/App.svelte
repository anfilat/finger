<script>
	import { onDestroy } from 'svelte';
	import { TrainingType, trainingType, training } from './service/trainingType';
	import { SelectedLanguage } from './service/language';
	import { Start, setupMode } from './service/setupMode';
	import KeyPress from './components/KeyPress.svelte';
	import * as oneKey from './trainings/selectKeys';
	import * as randomKey from './trainings/randomKeys';

	let { setupOk, getNextKeys, setupComponent } = oneKey;

	onDestroy(setupMode.subscribe(value => {
		if (!value) {
			start();
		}
	}));

	onDestroy(trainingType.subscribe(value => {
		if (value == training.selectKeys) {
			({ setupOk, getNextKeys, setupComponent } = oneKey);
		} else {
			({ setupOk, getNextKeys, setupComponent } = randomKey);
		}
	}));

	let targetKey;
	let nextKey;
	let lastKeys = '';

	function start() {
		nextKey = null;
		next();
	}

	function onKey(event) {
		const key = event.detail;

		if (key === 'backspace') {
			lastKeys = lastKeys.slice(0, -1);
		} else if (key.length === 1) {
			lastKeys += key;
		}
		check();
	}

	let timer = null;

	function check() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			if (lastKeys == targetKey) {
				next();
			}
		}, 10);
	}

	function next() {
		lastKeys = '';

		if (nextKey) {
			targetKey = nextKey;
			nextKey = null;
			return;
		}

		[targetKey, nextKey] = getNextKeys();
	}
</script>

<style>
	.main {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
		padding: 20px;
        min-height: 100vh;
        box-sizing: border-box;
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
        font-family: monospace;
	}

	.lastKeys {
		display: flex;
	}
</style>

<div class="main">
	<div class="main-container">
		<Start {setupOk}/>

		{#if $setupMode}
			<SelectedLanguage/>
			<TrainingType/>
			<svelte:component this={setupComponent}/>
		{:else}
			<KeyPress on:key={onKey}/>
			<div class="keys">
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
