import {writable} from 'svelte/store';
import {isKey} from '../../data/keys';
import {selectedLanguage} from "../../service/language";

export const selectKeys = (function() {
	const { subscribe, update, set } = writable('');

	return {
		subscribe,
		removeLastKey() {
			update(keys => keys.slice(0, -1));
		},
		addKey(key) {
			if (!isKey(key)) {
				return;
			}
			update(keys => {
				return keys.includes(key)
					? keys
					: keys + key;
			});
		},
		reset() {
			set('');
		},
	};
})();

selectedLanguage.subscribe(() => selectKeys.reset());
