<script>
	import 'bulma/css/bulma.css'
	import { training, trainingType } from './index';
</script>

<div class="block">
	Select training
</div>
<div class="control block">
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={training.selectKeys}>
		Select Keys
	</label>
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={training.randomKey}>
		Random Key
	</label>
</div>
