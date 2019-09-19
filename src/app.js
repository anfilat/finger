import { writable } from 'svelte/store';

export const OneKeyTraining = 0;
export const RandomKeyTraining = 1;

export const trainingType = writable(OneKeyTraining);
export const setupMode = writable(true);
