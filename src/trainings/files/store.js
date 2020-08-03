import {writable} from 'svelte/store';
import md5 from 'md5';

export const currentFile = writable(null);

export const files = (function() {
    let items = JSON.parse(localStorage.getItem('files') || '[]');
    const { subscribe, set } = writable(items);

    let currentFileValue = null;
    currentFile.subscribe(value => currentFileValue = value);

    return {
        subscribe,
        add(name, text) {
            const id = md5(text);
            const isItem = items.some(item => item.id === id);
            if (isItem) {
                return;
            }

            const lines = text
                .split('\n')
                .map(line => line
                    .replace(/\s+/g, ' ')
                    .trim()
                )
                .filter(line => line);

            items.push({
                id,
                name,
                current: 0,
                count: lines.length,
            });
            localStorage.setItem('files', JSON.stringify(items));
            localStorage.setItem(id, JSON.stringify(lines));
            set(items);
        },
        delete(id) {
            items = items.filter(item => item.id !== id);
            localStorage.setItem('files', JSON.stringify(items));
            localStorage.removeItem(id);
            set(items);

            if (currentFileValue === id) {
                currentFile.set(null);
            }
        },
        incrementCurrent(id) {
            const item = items.find(item => item.id === id);
            item.current++;
            localStorage.setItem('files', JSON.stringify(items));
            set(items);
        },
        get(id) {
            const item = items.find(item => item.id === id);
            return {
                ...item,
                lines: JSON.parse(localStorage.getItem(id)),
            };
        },
    };
})();
