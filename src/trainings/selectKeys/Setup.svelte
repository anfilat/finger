<script>
	import KeyPress from '../../components/KeyPress.svelte';
    import {selectKeys} from './store';

	function onKey(event) {
		const key = event.detail.toLowerCase();
		selectKeys.addKey(key);
	}

	function onBackSpace() {
		selectKeys.removeLastKey();
	}
</script>

<style>
	.keys {
		font-size: 64px;
	}
</style>

<KeyPress
	on:key={onKey}
	on:backspace={onBackSpace}
/>

<div>
	Press training keys
</div>
<div class="keys">
	{$selectKeys}
</div>
