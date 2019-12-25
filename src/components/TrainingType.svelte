<script>
	import 'bulma/css/bulma.css'

	export let OneKeyTraining;
	export let RandomKeyTraining;
	export let trainingType;
</script>

<div class="block">
	Select training
</div>
<div class="control block">
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={OneKeyTraining}>
		One Key
	</label>
	<label class="radio">
		<input type=radio bind:group={$trainingType} value={RandomKeyTraining}>
		Random Key
	</label>
</div>
