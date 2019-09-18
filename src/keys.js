const keys = [
	{key: 'ё', base: 'ф'},

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
];

export const leftHand = 1;
export const rightHand = 2;

export const hand = {
	ф: leftHand,
	ы: leftHand,
	в: leftHand,
	а: leftHand,
	о: rightHand,
	л: rightHand,
	д: rightHand,
	ж: rightHand,
};

export function getKeyData(value) {
	value = value.toLowerCase();
	return keys.find(({key}) => key == value);
}
