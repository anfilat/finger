import { writable } from 'svelte/store';

export const SelectKeysTraining = 0;
export const RandomKeyTraining = 1;

export const trainingType = writable(SelectKeysTraining);
export const setupMode = writable(true);
