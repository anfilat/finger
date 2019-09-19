<script>
	import KeyPress from '../../components/KeyPress.svelte';
    import { selectKey, setSelectKey } from './training';

    function onKey(event) {
		setSelectKey(event.detail);
	}
</script>

<style>
	.key {
		font-size: 30px;
	}
</style>

<KeyPress on:key={onKey} />

<div>
	Press the training key
</div>
<div class="key">
	{$selectKey}
</div>
