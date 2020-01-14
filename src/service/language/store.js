import {writable} from "svelte/store";
import {language} from "./consts";

export const selectedLanguage = writable(language.en);
