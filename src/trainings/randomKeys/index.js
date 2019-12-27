import { readable } from 'svelte/store';
import { getRandomKeys } from '../../data/keys';

export const setupOk = readable(true, () => {});
export const getNextKeys = getRandomKeys;
