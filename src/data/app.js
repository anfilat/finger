import { writable } from 'svelte/store';

export const training = {
	selectKeys: 0,
	randomKey: 1,
};

export const trainingType = writable(training.selectKeys);
export const setupMode = writable(true);
