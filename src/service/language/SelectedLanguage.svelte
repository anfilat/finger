<script>
	import {language} from './consts';
	import {selectedLanguage} from './store';
</script>

<div class="block">
    Select language
</div>
<div class="block flex">
    <label class="radio">
        <input type=radio bind:group={$selectedLanguage} value={language.en}>
        English
    </label>
    <label class="radio">
        <input type=radio bind:group={$selectedLanguage} value={language.ru}>
        Russian
    </label>
</div>
