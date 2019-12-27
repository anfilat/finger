import { writable } from 'svelte/store';

export const setupMode = writable(true);

export { default as Start } from './Start.svelte';
