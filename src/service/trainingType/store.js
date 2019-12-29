import {writable} from "svelte/store";
import {training} from "./consts";

export const trainingType = writable(training.selectKeys);
