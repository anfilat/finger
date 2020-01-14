import { readable } from 'svelte/store';
import { getRandomKey } from '../../data/keys';

export const setupOk = readable(true, () => {});
export const getNextKeys = getRandomKey;
