<script>
    import KeyPress from './KeyPress.svelte';

    export let getNextKeys;

    let targetKeys = '';
    let nextKeys = null;
    let lastKeys = '';
    let entered = '';

    next();

    function onKey(event) {
        const key = event.detail;

        if (key.toLowerCase() === 'backspace') {
            lastKeys = lastKeys.slice(0, -1);
        } else if (key.length === 1) {
            lastKeys += key;
        }
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
        entered = lastKeys;

        const len = Math.min(targetKeys.length, lastKeys.length);
        for (let i = 0; i < len; i++) {
            if (targetKeys[i] != lastKeys[i]) {
                entered = entered.substring(0, i) +
                    `<span class='error'>${entered[i]}</span>` +
                    entered.substring(i + 1);
                break;
            }
        }
    } else {
        entered = ' ';
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

    .lastKeys {
        margin: 0;
    }

    :global(.error) {
        color: #f33;
    }
</style>

<KeyPress on:key={onKey}/>
<div class="keys">
    <div>{targetKeys}</div>
    <pre class="lastKeys">
		{@html entered}
	</pre>
</div>
