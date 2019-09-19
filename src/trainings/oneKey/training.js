import { writable, derived } from 'svelte/store';
import { getKeyData, getHandBase } from '../../keys';

export const selectKey = writable('');
export const setupOk = derived(
	selectKey,
	$selectKey => !!$selectKey
);

let keyData;

export function setSelectKey(key) {
	const data = getKeyData(key);
	if (data) {
		keyData = data;
		selectKey.set(key);
	}
}

let next;

export function getNextKey() {
	if (next) {
		const result = next;
		next = null;
		return result;
	}

	next = getHandBase(keyData);
	return keyData.key;
}

export function reset() {
	next = null;
}
