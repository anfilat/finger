<script>
	import KeyPress from '../../components/KeyPress.svelte';
    import {selectKeys} from './store';

	function onKey(event) {
		const key = event.detail.toLowerCase();

		if (key === 'backspace') {
			selectKeys.removeLastKey();
		} else {
			selectKeys.addKey(key);
		}
	}
</script>

<style>
	.keys {
		font-size: 64px;
	}
</style>

<KeyPress on:key={onKey}/>

<div>
	Press training keys
</div>
<div class="keys">
	{$selectKeys}
</div>
