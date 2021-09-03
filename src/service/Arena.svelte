<script>
    import KeyPress from '../components/KeyPress.svelte';
    import {trainingType, training} from './trainingType';

    export let getNextKeys;

    let targetKeys = '';
    let nextKeys = null;
    let lastKeys = '';
    let entered = '';

    next();

    function onKey(event) {
        const key = event.detail;

        if (key.length === 1) {
            lastKeys += key;
        }
        check();
    }

    function onBackSpace() {
        lastKeys = lastKeys.slice(0, -1);
        check();
    }

    let timer = null;

    function check() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (lastKeys == targetKeys) {
                next();
            }
        }, 10);
    }

    function next() {
        lastKeys = '';

        if (nextKeys) {
            targetKeys = nextKeys;
            nextKeys = null;
            return;
        }

        [targetKeys, nextKeys] = getNextKeys();
    }

    $: if (lastKeys) {
        entered = htmlSafe(lastKeys);

        const len = Math.min(targetKeys.length, lastKeys.length);
        for (let i = 0; i < len; i++) {
            if (targetKeys[i] != lastKeys[i]) {
                entered = htmlSafe(lastKeys.substring(0, i)) +
                    `<span class='error'>${htmlSafe(lastKeys.substring(i))}</span>`
                break;
            }
        }
    } else {
        entered = '&nbsp;';
    }

    function htmlSafe(str) {
        return str
            .replace(/\s/g, '&centerdot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
</script>

<style>
    .keys {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 64px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: monospace;
        white-space: nowrap;
    }

    .keys.long {
        font-size: 26px;
        white-space: normal;
        align-items: start;
        width: 80%;
    }

    .lastKeys {
        margin: 0;
    }

    :global(.error) {
        color: #f33;
    }
</style>

<KeyPress
    on:key={onKey}
    on:backspace={onBackSpace}
/>
<div class="keys" class:long={$trainingType === training.files}>
    <div>{targetKeys}</div>
    <div class="lastKeys">
		{@html entered}
	</div>
</div>
