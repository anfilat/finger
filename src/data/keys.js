const keys = [
	{key: 'ё', base: 'ф'},
	{key: '1', base: 'ф'},
	{key: '2', base: 'ф'},
	{key: '3', base: 'ы'},
	{key: '4', base: 'в'},
	{key: '5', base: 'а'},
	{key: '6', base: 'а'},
	{key: '7', base: 'о'},
	{key: '8', base: 'л'},
	{key: '9', base: 'д'},
	{key: '0', base: 'ж'},
	{key: '-', base: 'ж'},
	{key: '=', base: 'ж'},
	{key: '\\', base: 'ж'},

	{key: '!', base: 'ф'},
	{key: '"', base: 'ф'},
	{key: '№', base: 'ы'},
	{key: ';', base: 'в'},
	{key: '%', base: 'а'},
	{key: ':', base: 'а'},
	{key: '?', base: 'о'},
	{key: '*', base: 'л'},
	{key: '(', base: 'д'},
	{key: ')', base: 'ж'},
	{key: '_', base: 'ж'},
	{key: '+', base: 'ж'},
	{key: '/', base: 'ж'},

	{key: 'й', base: 'ф'},
	{key: 'ц', base: 'ы'},
	{key: 'у', base: 'в'},
	{key: 'к', base: 'а'},
	{key: 'е', base: 'а'},
	{key: 'н', base: 'о'},
	{key: 'г', base: 'о'},
	{key: 'ш', base: 'л'},
	{key: 'щ', base: 'д'},
	{key: 'з', base: 'ж'},
	{key: 'х', base: 'ж'},
	{key: 'ъ', base: 'ж'},

	{key: 'ф'},
	{key: 'ы'},
	{key: 'в'},
	{key: 'а'},
	{key: 'п', base: 'а'},
	{key: 'р', base: 'о'},
	{key: 'о'},
	{key: 'л'},
	{key: 'д'},
	{key: 'ж'},
	{key: 'э', base: 'ж'},

	{key: 'я', base: 'ф'},
	{key: 'ч', base: 'ы'},
	{key: 'с', base: 'в'},
	{key: 'м', base: 'а'},
	{key: 'и', base: 'а'},
	{key: 'т', base: 'о'},
	{key: 'ь', base: 'о'},
	{key: 'б', base: 'л'},
	{key: 'ю', base: 'д'},
	{key: '.', base: 'ж'},
	{key: ',', base: 'ж'},
];

export const leftHand = ['ф', 'ы', 'в', 'а'];
export const rightHand = ['о', 'л', 'д', 'ж'];

export const hands = {
	ф: leftHand,
	ы: leftHand,
	в: leftHand,
	а: leftHand,
	о: rightHand,
	л: rightHand,
	д: rightHand,
	ж: rightHand,
};

export function isKey(value) {
	return keys.some(({key}) => key == value);
}

export function getFromSelectedKeys(selected) {
	const key = selected[Math.floor(Math.random() * selected.length)];
	const keyData = keys.find(data => data.key === key);
	return [keyData.key, getHandBase(keyData)];
}

export function getRandomKeys() {
	const keyData = keys[Math.floor(Math.random() * keys.length)];
	return [keyData.key, getHandBase(keyData)];
}

function getHandBase(keyData) {
	if (keyData.base) {
		return hands[keyData.base][Math.floor(Math.random() * 4)];
	}
	return null;
}
