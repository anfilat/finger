<script>
	import 'bulma/css/bulma.css'
	import {language} from './consts';
	import {selectedLanguage} from './store';
</script>

<div class="block">
	Select language
</div>
<div class="control block">
	<label class="radio">
		<input type=radio bind:group={$selectedLanguage} value={language.en}>
		English
	</label>
	<label class="radio">
		<input type=radio bind:group={$selectedLanguage} value={language.ru}>
		Russian
	</label>
</div>
