<script>
	import KeyPress from '../../components/KeyPress.svelte';
    import { selectKeys, onKey } from './training';
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
