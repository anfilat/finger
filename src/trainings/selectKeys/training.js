import { writable, derived } from 'svelte/store';
import { isKey, getFromSelectedKeys } from '../../data/keys';

export const selectKeys = writable('');
export const setupOk = derived(
	selectKeys,
	$selectKeys => $selectKeys.length > 0
);

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

let next;

export function getNextKey() {
	if (next) {
		const result = next;
		next = null;
		return result;
	}

	const keys = getFromSelectedKeys(selected);
	next = keys[1];
	return keys[0];
}

export function reset() {
	next = null;
}
