import {writable} from 'svelte/store';
import {isKey} from '../../data/keys';

export const selectKeys = (function() {
	const { subscribe, update } = writable('');

	return {
		subscribe,
		removeLastKey: () => {
			update(keys => keys.slice(0, -1));
		},
		addKey: (key) => {
			if (!isKey(key)) {
				return;
			}
			update(keys => {
				return keys.includes(key)
					? keys
					: keys + key;
			});
		},
	};
})();
