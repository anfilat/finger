import { readable } from 'svelte/store';
import { getRandomKeys } from '../../data/keys';

export const setupOk = readable(true, () => {});

let next;

export function getNextKey() {
	if (next) {
		const result = next;
		next = null;
		return result;
	}

	const keys = getRandomKeys();
	next = keys[1];
	return keys[0];
}

export function reset() {
	next = null;
}
