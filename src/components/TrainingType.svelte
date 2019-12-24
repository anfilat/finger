<script>
	export let OneKeyTraining;
	export let RandomKeyTraining;
	export let trainingType;
</script>

<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.buttons {
		display: flex;
		margin: 10px 0;
	}

	label:first-child {
		margin-right: 20px;
	}
</style>

<div class="main">
	Select training
	<div class="buttons">
		<label>
			<input type=radio bind:group={$trainingType} value={OneKeyTraining}>
			One Key
		</label>
		<label>
			<input type=radio bind:group={$trainingType} value={RandomKeyTraining}>
			Random Key
		</label>
	</div>
</div>
