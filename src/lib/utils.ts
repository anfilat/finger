/**
 * Заменить whitespace символы на точку (·)
 */
export function replaceWhitespace(text: string): string {
  return text.replace(/\s/g, '·');
}

/**
 * Найти индекс первой ошибки в двух строках
 * Возвращает -1, если строки совпадают до конца entered
 */
export function findFirstError(target: string, entered: string): number {
  const minLength = Math.min(target.length, entered.length);
  
  for (let i = 0; i < minLength; i++) {
    if (target[i] !== entered[i]) {
      return i;
    }
  }
  
  // Если entered длиннее target, ошибка на позиции minLength
  if (entered.length > target.length) {
    return minLength;
  }
  
  // Строки совпадают до конца entered
  return -1;
}
