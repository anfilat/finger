import { writable, derived } from 'svelte/store';
import { isKey, getFromSelectedKeys } from '../../data/keys';

export const selectKeys = writable('');
let selected = '';

export function onKey(event) {
	const key = event.detail;

	if (key === 'backspace') {
		return removeLastKey();
	}
	if (!isKey(key)) {
		return;
	}
	if (selected.includes(key)) {
		return;
	}

	addKey(key);
}

function removeLastKey() {
	selected = selected.slice(0, -1);
	selectKeys.set(selected);
}

function addKey(key) {
	selected += key;
	selectKeys.set(selected);
}

export const setupOk = derived(
	selectKeys,
	$selectKeys => $selectKeys.length > 0
);

export function getNextKeys() {
	return getFromSelectedKeys(selected);
}
