<script>
	import {training} from './consts';
	import {trainingType} from './store';
</script>

<div class="block">
	Select training
</div>
<div class="block flex">
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={training.selectKeys}>
		Select Keys
	</label>
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={training.randomKey}>
		Random Key
	</label>
</div>
