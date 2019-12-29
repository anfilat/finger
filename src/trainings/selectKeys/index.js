import {derived} from "svelte/store";
import {selectKeys} from "./store";
import {getFromSelectedKeys} from "../../data/keys";

export { default as setupComponent } from './Setup.svelte';

let selected = '';
selectKeys.subscribe(value => selected = value);

export const setupOk = derived(
	selectKeys,
	$selectKeys => $selectKeys.length > 0
);

export function getNextKeys() {
	return getFromSelectedKeys(selected);
}
