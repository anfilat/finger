<script>
	import {onDestroy} from 'svelte';
	import {TrainingType, trainingType, training} from './service/trainingType';
	import {SelectedLanguage} from './service/language';
	import {Start, setupMode} from './service/setupMode';
	import Arena from "./components/Arena.svelte";
	import * as oneKey from './trainings/selectKeys';
	import * as randomKey from './trainings/randomKeys';
	import * as phrases from './trainings/phrases';

	let {setupOk, getNextKeys, setupComponent} = oneKey;

	onDestroy(trainingType.subscribe(value => {
		switch (value) {
			case training.selectKeys:
				({setupOk, getNextKeys, setupComponent} = oneKey);
				break;
			case training.randomKey:
				({setupOk, getNextKeys, setupComponent} = randomKey);
				break;
			case training.phrases:
				({setupOk, getNextKeys, setupComponent} = phrases);
				break;
		}
	}));
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
</style>

<div class="main">
	<div class="main-container">
		<Start {setupOk}/>

		{#if $setupMode}
			<SelectedLanguage/>
			<TrainingType/>
			<svelte:component this={setupComponent}/>
		{:else}
			<Arena {getNextKeys}/>
		{/if}
	</div>
</div>
