<script>
	import KeyPress from './KeyPress.svelte';
    import { selectKey, setSelectKey } from './oneKey';

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
	Нажмите тренируемую клавишу
</div>
<div class="key">
	{$selectKey}
</div>
