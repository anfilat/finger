<script>
	import KeyPress from '../../components/KeyPress.svelte';
    import { selectKey, setSelectKey } from './training';
</script>

<style>
	.key {
		font-size: 30px;
	}
</style>

<KeyPress on:key={(event) => setSelectKey(event.detail)} />

<div>
	Press the training key
</div>
<div class="key">
	{$selectKey}
</div>
