import {readable} from 'svelte/store';
import wordsEn from 'an-array-of-english-words';
import wordsRu from '../../../node_modules/wordlist-russian/russian-words.json';
import {selectedLanguage} from "../../service/language";

let lang = '';
selectedLanguage.subscribe(value => lang = value);

export const setupOk = readable(true, () => {});

export function getNextKeys() {
	const phrase = capitalize(getWord()) + ' ' + getWord() + getPunctuation();
	return [phrase, null];
}

function getWord() {
	const items = lang == 'en' ? wordsEn : wordsRu;
	return items[Math.floor(Math.random() * items.length)];
}

function capitalize(str) {
	return str[0].toUpperCase() + str.substr(1);
}

const punctuations = '.,?!:;-';

function getPunctuation() {
	return punctuations[Math.floor(Math.random() * punctuations.length)];
}
