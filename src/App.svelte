<script>
	import { onDestroy } from 'svelte';
	import { TrainingType, trainingType, training } from './service/trainingType';
	import { SelectedLanguage } from './service/language';
	import { Start, setupMode } from './service/setupMode';
	import KeyPress from './components/KeyPress.svelte';
	import * as oneKey from './trainings/selectKeys';
	import * as randomKey from './trainings/randomKeys';
	import * as phrases from './trainings/phrases';

	let { setupOk, getNextKeys, setupComponent } = oneKey;

	onDestroy(setupMode.subscribe(value => {
		if (!value) {
			start();
		}
	}));

	onDestroy(trainingType.subscribe(value => {
		switch (value) {
			case training.selectKeys:
				({ setupOk, getNextKeys, setupComponent } = oneKey);
				break;
			case training.randomKey:
				({ setupOk, getNextKeys, setupComponent } = randomKey);
				break;
			case training.phrases:
				({ setupOk, getNextKeys, setupComponent } = phrases);
				break;
		}
	}));

	let targetKeys;
	let nextKeys;
	let lastKeys = '';

	function start() {
		nextKeys = null;
		next();
	}

	function onKey(event) {
		const key = event.detail;

		if (key.toLowerCase() === 'backspace') {
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
			if (lastKeys == targetKeys) {
				next();
			}
		}, 10);
	}

	function next() {
		lastKeys = '';

		if (nextKeys) {
			targetKeys = nextKeys;
			nextKeys = null;
			return;
		}

		[targetKeys, nextKeys] = getNextKeys();
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
		white-space: nowrap;
	}

	.lastKeys {
		margin: 0;
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
				<div>{targetKeys}</div>
				<pre class="lastKeys">
					{@html lastKeys ? lastKeys : ' '}
				</pre>
			</div>
		{/if}
	</div>
</div>
