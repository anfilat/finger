import { writable } from 'svelte/store';
import { getRandomKeyData, getHandBase } from '../../keys';

export const setupOk = writable(true);

let next;

export function getNextKey() {
	if (next) {
		const result = next;
		next = null;
		return result;
	}

	const keyData = getRandomKeyData();
	next = getHandBase(keyData);
	return keyData.key;
}

export function reset() {
	next = null;
}
