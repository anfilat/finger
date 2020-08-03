import {derived} from 'svelte/store';
import {setupMode} from '../../service/setupMode';
import {currentFile, files} from "./store";

export { default as setupComponent } from './Setup.svelte';

let data = null;
setupMode.subscribe(value => {
    if (!value) {
        data = null;
    }
});

let currentFileId = null;
currentFile.subscribe(value => currentFileId = value);

export const setupOk = derived(
    currentFile,
    $derived => !!$derived
);

export function getNextKeys() {
    const first = !data;
    if (!data) {
        data = files.get(currentFileId);
    }
    if (data.current === data.count) {
        return ['', null];
    }

    if (!first) {
        data.current++;
        files.incrementCurrent(currentFileId);
    }
    const line = data.lines[data.current];
    return [line, null];
}
