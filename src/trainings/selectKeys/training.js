import { writable, derived } from 'svelte/store';
import { isKey, getFromSelectedKeys } from '../../data/keys';

export const selectKeys = writable('');
let selected = '';

export function onKey(event) {
	const key = event.detail;

	if (key === 'backspace') {
		selected = selected.slice(0, -1);
		selectKeys.set(selected);
		return;
	}

	if (!isKey(key)) {
		return;
	}

	selected = selected + key;
	selectKeys.set(selected);
}

export const setupOk = derived(
	selectKeys,
	$selectKeys => $selectKeys.length > 0
);

export function getNextKeys() {
	return getFromSelectedKeys(selected);
}
