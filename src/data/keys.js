import {selectedLanguage} from "../service/language";

let lang = '';
selectedLanguage.subscribe(value => lang = value);

export function isKey(value) {
	return keys[lang].some(({key}) => key == value);
}

export function getFromSelectedKeys(selected) {
	const key = getRandomItem(selected);
	const keyData = keys[lang].find(data => data.key === key);
	return [keyData.key, getHandBase(keyData)];
}

export function getRandomKey() {
	const keyData = getRandomItem(keys);
	return [keyData.key, getHandBase(keyData)];
}

function getHandBase(keyData) {
	return keyData.base
		? getRandomItem(keyData.base[lang])
		: null;
}

function getRandomItem(items) {
	return items[Math.floor(Math.random() * items.length)];
}

const leftHand = {
	ru: 'фыва',
	en: 'asdf',
};
const rightHand = {
	ru: 'олдж',
	en: 'jkl;',
};

const keys = {
	ru: [
		{key: 'ё', base: leftHand},
		{key: '1', base: leftHand},
		{key: '2', base: leftHand},
		{key: '3', base: leftHand},
		{key: '4', base: leftHand},
		{key: '5', base: leftHand},
		{key: '6', base: leftHand},
		{key: '7', base: rightHand},
		{key: '8', base: rightHand},
		{key: '9', base: rightHand},
		{key: '0', base: rightHand},
		{key: '-', base: rightHand},
		{key: '=', base: rightHand},
		{key: '\\', base: rightHand},

		{key: '!', base: leftHand},
		{key: '"', base: leftHand},
		{key: '№', base: leftHand},
		{key: ';', base: leftHand},
		{key: '%', base: leftHand},
		{key: ':', base: leftHand},
		{key: '?', base: rightHand},
		{key: '*', base: rightHand},
		{key: '(', base: rightHand},
		{key: ')', base: rightHand},
		{key: '_', base: rightHand},
		{key: '+', base: rightHand},
		{key: '/', base: rightHand},

		{key: 'й', base: leftHand},
		{key: 'ц', base: leftHand},
		{key: 'у', base: leftHand},
		{key: 'к', base: leftHand},
		{key: 'е', base: leftHand},
		{key: 'н', base: rightHand},
		{key: 'г', base: rightHand},
		{key: 'ш', base: rightHand},
		{key: 'щ', base: rightHand},
		{key: 'з', base: rightHand},
		{key: 'х', base: rightHand},
		{key: 'ъ', base: rightHand},

		{key: 'ф'},
		{key: 'ы'},
		{key: 'в'},
		{key: 'а'},
		{key: 'п', base: leftHand},
		{key: 'р', base: rightHand},
		{key: 'о'},
		{key: 'л'},
		{key: 'д'},
		{key: 'ж'},
		{key: 'э', base: rightHand},

		{key: 'я', base: leftHand},
		{key: 'ч', base: leftHand},
		{key: 'с', base: leftHand},
		{key: 'м', base: leftHand},
		{key: 'и', base: leftHand},
		{key: 'т', base: rightHand},
		{key: 'ь', base: rightHand},
		{key: 'б', base: rightHand},
		{key: 'ю', base: rightHand},
		{key: '.', base: rightHand},
		{key: ',', base: rightHand},
	],
	en: [
		{key: '`', base: leftHand},
		{key: '1', base: leftHand},
		{key: '2', base: leftHand},
		{key: '3', base: leftHand},
		{key: '4', base: leftHand},
		{key: '5', base: leftHand},
		{key: '6', base: leftHand},
		{key: '7', base: rightHand},
		{key: '8', base: rightHand},
		{key: '9', base: rightHand},
		{key: '0', base: rightHand},
		{key: '-', base: rightHand},
		{key: '=', base: rightHand},
		{key: '\\', base: rightHand},

		{key: '~', base: leftHand},
		{key: '!', base: leftHand},
		{key: '@', base: leftHand},
		{key: '#', base: leftHand},
		{key: '$', base: leftHand},
		{key: '%', base: leftHand},
		{key: '^', base: leftHand},
		{key: '&', base: rightHand},
		{key: '*', base: rightHand},
		{key: '(', base: rightHand},
		{key: ')', base: rightHand},
		{key: '_', base: rightHand},
		{key: '+', base: rightHand},
		{key: '|', base: rightHand},

		{key: 'q', base: leftHand},
		{key: 'w', base: leftHand},
		{key: 'e', base: leftHand},
		{key: 'r', base: leftHand},
		{key: 't', base: leftHand},
		{key: 'y', base: rightHand},
		{key: 'u', base: rightHand},
		{key: 'i', base: rightHand},
		{key: 'o', base: rightHand},
		{key: 'p', base: rightHand},
		{key: '[', base: rightHand},
		{key: ']', base: rightHand},

		{key: '{', base: rightHand},
		{key: '}', base: rightHand},

		{key: 'a'},
		{key: 's'},
		{key: 'd'},
		{key: 'f'},
		{key: 'g', base: leftHand},
		{key: 'h', base: rightHand},
		{key: 'j'},
		{key: 'k'},
		{key: 'l'},
		{key: ';'},
		{key: '\'', base: rightHand},

		{key: ':', base: rightHand},
		{key: '"', base: rightHand},

		{key: 'z', base: leftHand},
		{key: 'x', base: leftHand},
		{key: 'c', base: leftHand},
		{key: 'v', base: leftHand},
		{key: 'b', base: leftHand},
		{key: 'n', base: rightHand},
		{key: 'm', base: rightHand},
		{key: ',', base: rightHand},
		{key: '.', base: rightHand},
		{key: '/', base: rightHand},

		{key: '<', base: rightHand},
		{key: '>', base: rightHand},
		{key: '?', base: rightHand},
	],
};
