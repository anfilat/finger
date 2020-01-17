
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const training = {
    	selectKeys: 0,
    	randomKey: 1,
    };

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const trainingType = writable(training.selectKeys);

    /* src\service\trainingType\TrainingType.svelte generated by Svelte v3.16.7 */
    const file = "src\\service\\trainingType\\TrainingType.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let label0;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let t3;
    	let label1;
    	let input1;
    	let input1_value_value;
    	let t4;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Select training";
    			t1 = space();
    			div1 = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t2 = text("\r\n\t\tSelect Keys");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = text("\r\n\t\tRandom Key");
    			attr_dev(div0, "class", "block");
    			add_location(div0, file, 6, 0, 131);
    			attr_dev(input0, "type", "radio");
    			input0.__value = input0_value_value = training.selectKeys;
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input0);
    			add_location(input0, file, 11, 2, 233);
    			attr_dev(label0, "class", "radio");
    			add_location(label0, file, 10, 1, 208);
    			attr_dev(input1, "type", "radio");
    			input1.__value = input1_value_value = training.randomKey;
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input1);
    			add_location(input1, file, 15, 2, 360);
    			attr_dev(label1, "class", "radio");
    			add_location(label1, file, 14, 1, 335);
    			attr_dev(div1, "class", "control block");
    			add_location(div1, file, 9, 0, 178);

    			dispose = [
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[1]),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[3])
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*$trainingType*/ ctx[0];
    			append_dev(label0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*$trainingType*/ ctx[0];
    			append_dev(label1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$trainingType*/ 1) {
    				input0.checked = input0.__value === /*$trainingType*/ ctx[0];
    			}

    			if (dirty & /*$trainingType*/ 1) {
    				input1.checked = input1.__value === /*$trainingType*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input1), 1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $trainingType;
    	validate_store(trainingType, "trainingType");
    	component_subscribe($$self, trainingType, $$value => $$invalidate(0, $trainingType = $$value));
    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		$trainingType = this.__value;
    		trainingType.set($trainingType);
    	}

    	function input1_change_handler() {
    		$trainingType = this.__value;
    		trainingType.set($trainingType);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$trainingType" in $$props) trainingType.set($trainingType = $$props.$trainingType);
    	};

    	return [$trainingType, input0_change_handler, $$binding_groups, input1_change_handler];
    }

    class TrainingType extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrainingType",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const language = {
    	en: 'en',
    	ru: 'ru',
    };

    const selectedLanguage = writable(language.en);

    /* src\service\language\SelectedLanguage.svelte generated by Svelte v3.16.7 */
    const file$1 = "src\\service\\language\\SelectedLanguage.svelte";

    function create_fragment$1(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let label0;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let t3;
    	let label1;
    	let input1;
    	let input1_value_value;
    	let t4;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Select language";
    			t1 = space();
    			div1 = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t2 = text("\r\n\t\tEnglish");
    			t3 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t4 = text("\r\n\t\tRussian");
    			attr_dev(div0, "class", "block");
    			add_location(div0, file$1, 6, 0, 135);
    			attr_dev(input0, "type", "radio");
    			input0.__value = input0_value_value = language.en;
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input0);
    			add_location(input0, file$1, 11, 2, 237);
    			attr_dev(label0, "class", "radio");
    			add_location(label0, file$1, 10, 1, 212);
    			attr_dev(input1, "type", "radio");
    			input1.__value = input1_value_value = language.ru;
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input1);
    			add_location(input1, file$1, 15, 2, 356);
    			attr_dev(label1, "class", "radio");
    			add_location(label1, file$1, 14, 1, 331);
    			attr_dev(div1, "class", "control block");
    			add_location(div1, file$1, 9, 0, 182);

    			dispose = [
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[1]),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[3])
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*$selectedLanguage*/ ctx[0];
    			append_dev(label0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*$selectedLanguage*/ ctx[0];
    			append_dev(label1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$selectedLanguage*/ 1) {
    				input0.checked = input0.__value === /*$selectedLanguage*/ ctx[0];
    			}

    			if (dirty & /*$selectedLanguage*/ 1) {
    				input1.checked = input1.__value === /*$selectedLanguage*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input1), 1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $selectedLanguage;
    	validate_store(selectedLanguage, "selectedLanguage");
    	component_subscribe($$self, selectedLanguage, $$value => $$invalidate(0, $selectedLanguage = $$value));
    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		$selectedLanguage = this.__value;
    		selectedLanguage.set($selectedLanguage);
    	}

    	function input1_change_handler() {
    		$selectedLanguage = this.__value;
    		selectedLanguage.set($selectedLanguage);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$selectedLanguage" in $$props) selectedLanguage.set($selectedLanguage = $$props.$selectedLanguage);
    	};

    	return [
    		$selectedLanguage,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler
    	];
    }

    class SelectedLanguage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectedLanguage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const setupMode = writable(true);

    /* src\service\setupMode\Start.svelte generated by Svelte v3.16.7 */
    const file$2 = "src\\service\\setupMode\\Start.svelte";

    // (13:0) {#if $setupMode}
    function create_if_block(ctx) {
    	let button;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Start");
    			attr_dev(button, "class", "button is-primary is-large block");
    			button.disabled = /*disabled*/ ctx[1];
    			add_location(button, file$2, 13, 1, 238);
    			dispose = listen_dev(button, "click", stop_propagation(/*click_handler_1*/ ctx[5]), false, false, true);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if $setupMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t;
    	let if_block_anchor;
    	document.body.addEventListener("click", /*click_handler*/ ctx[4]);
    	let if_block = /*$setupMode*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$setupMode*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			document.body.removeEventListener("click", /*click_handler*/ ctx[4]);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $setupOk,
    		$$unsubscribe_setupOk = noop,
    		$$subscribe_setupOk = () => ($$unsubscribe_setupOk(), $$unsubscribe_setupOk = subscribe(setupOk, $$value => $$invalidate(3, $setupOk = $$value)), setupOk);

    	let $setupMode;
    	validate_store(setupMode, "setupMode");
    	component_subscribe($$self, setupMode, $$value => $$invalidate(2, $setupMode = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_setupOk());
    	let { setupOk } = $$props;
    	validate_store(setupOk, "setupOk");
    	$$subscribe_setupOk();
    	let disabled;
    	const writable_props = ["setupOk"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Start> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setupMode.set(true);
    	const click_handler_1 = () => setupMode.set(false);

    	$$self.$set = $$props => {
    		if ("setupOk" in $$props) $$subscribe_setupOk($$invalidate(0, setupOk = $$props.setupOk));
    	};

    	$$self.$capture_state = () => {
    		return { setupOk, disabled, $setupOk, $setupMode };
    	};

    	$$self.$inject_state = $$props => {
    		if ("setupOk" in $$props) $$subscribe_setupOk($$invalidate(0, setupOk = $$props.setupOk));
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("$setupOk" in $$props) setupOk.set($setupOk = $$props.$setupOk);
    		if ("$setupMode" in $$props) setupMode.set($setupMode = $$props.$setupMode);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$setupOk*/ 8) {
    			 $$invalidate(1, disabled = !$setupOk);
    		}
    	};

    	return [setupOk, disabled, $setupMode, $setupOk, click_handler, click_handler_1];
    }

    class Start extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { setupOk: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Start",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*setupOk*/ ctx[0] === undefined && !("setupOk" in props)) {
    			console.warn("<Start> was created without expected prop 'setupOk'");
    		}
    	}

    	get setupOk() {
    		throw new Error("<Start>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setupOk(value) {
    		throw new Error("<Start>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\KeyPress.svelte generated by Svelte v3.16.7 */

    function create_fragment$3(ctx) {
    	document.body.addEventListener("keydown", /*onKeyDown*/ ctx[0]);

    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			document.body.removeEventListener("keydown", /*onKeyDown*/ ctx[0]);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self) {
    	const dispatch = createEventDispatcher();

    	function onKeyDown(event) {
    		dispatch("key", event.key.toLowerCase());
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [onKeyDown];
    }

    class KeyPress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyPress",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    let lang = '';
    selectedLanguage.subscribe(value => lang = value);

    function isKey(value) {
    	return keys[lang].some(({key}) => key == value);
    }

    function getFromSelectedKeys(selected) {
    	const key = getRandomItem(selected);
    	const keyData = keys[lang].find(data => data.key === key);
    	return [keyData.key, getHandBase(keyData)];
    }

    function getRandomKey() {
    	const keyData = getRandomItem(keys[lang]);
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

    const selectKeys = (function() {
    	const { subscribe, update, set } = writable('');

    	return {
    		subscribe,
    		removeLastKey: () => {
    			update(keys => keys.slice(0, -1));
    		},
    		addKey: (key) => {
    			if (!isKey(key)) {
    				return;
    			}
    			update(keys => {
    				return keys.includes(key)
    					? keys
    					: keys + key;
    			});
    		},
    		reset: () => {
    			set('');
    		},
    	};
    })();

    selectedLanguage.subscribe(() => selectKeys.reset());

    /* src\trainings\selectKeys\Setup.svelte generated by Svelte v3.16.7 */
    const file$3 = "src\\trainings\\selectKeys\\Setup.svelte";

    function create_fragment$4(ctx) {
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let current;
    	const keypress = new KeyPress({ $$inline: true });
    	keypress.$on("key", onKey);

    	const block = {
    		c: function create() {
    			create_component(keypress.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Press training keys";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*$selectKeys*/ ctx[0]);
    			add_location(div0, file$3, 23, 0, 378);
    			attr_dev(div1, "class", "keys svelte-j6ivth");
    			add_location(div1, file$3, 26, 0, 415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keypress, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$selectKeys*/ 1) set_data_dev(t3, /*$selectKeys*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keypress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keypress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keypress, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onKey(event) {
    	const key = event.detail;

    	if (key === "backspace") {
    		selectKeys.removeLastKey();
    	} else {
    		selectKeys.addKey(key);
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $selectKeys;
    	validate_store(selectKeys, "selectKeys");
    	component_subscribe($$self, selectKeys, $$value => $$invalidate(0, $selectKeys = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$selectKeys" in $$props) selectKeys.set($selectKeys = $$props.$selectKeys);
    	};

    	return [$selectKeys];
    }

    class Setup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Setup",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    let selected = '';
    selectKeys.subscribe(value => selected = value);

    const setupOk = derived(
    	selectKeys,
    	$selectKeys => $selectKeys.length > 0
    );

    function getNextKeys() {
    	return getFromSelectedKeys(selected);
    }

    var oneKey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setupOk: setupOk,
        getNextKeys: getNextKeys,
        setupComponent: Setup
    });

    const setupOk$1 = readable(true, () => {});
    const getNextKeys$1 = getRandomKey;

    var randomKey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setupOk: setupOk$1,
        getNextKeys: getNextKeys$1
    });

    /* src\App.svelte generated by Svelte v3.16.7 */
    const file$4 = "src\\App.svelte";

    // (107:2) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let div4;
    	let div0;
    	let t1;
    	let t2;
    	let div3;
    	let div1;
    	let t4;
    	let html_tag;
    	let t5;
    	let div2;
    	let current;
    	const keypress = new KeyPress({ $$inline: true });
    	keypress.$on("key", /*onKey*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(keypress.$$.fragment);
    			t0 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t1 = text(/*targetKey*/ ctx[2]);
    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = " ";
    			t4 = space();
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = " ";
    			add_location(div0, file$4, 109, 4, 2064);
    			add_location(div1, file$4, 111, 5, 2119);
    			html_tag = new HtmlTag(/*lastKeys*/ ctx[3], t5);
    			add_location(div2, file$4, 113, 5, 2163);
    			attr_dev(div3, "class", "lastKeys svelte-1u4q00c");
    			add_location(div3, file$4, 110, 4, 2091);
    			attr_dev(div4, "class", "keys is-family-monospace svelte-1u4q00c");
    			add_location(div4, file$4, 108, 3, 2021);
    		},
    		m: function mount(target, anchor) {
    			mount_component(keypress, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t4);
    			html_tag.m(div3);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*targetKey*/ 4) set_data_dev(t1, /*targetKey*/ ctx[2]);
    			if (!current || dirty & /*lastKeys*/ 8) html_tag.p(/*lastKeys*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keypress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keypress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keypress, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(107:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:2) {#if $setupMode}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let switch_instance_anchor;
    	let current;
    	const selectedlanguage = new SelectedLanguage({ $$inline: true });
    	const trainingtype = new TrainingType({ $$inline: true });
    	var switch_value = /*setupComponent*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			create_component(selectedlanguage.$$.fragment);
    			t0 = space();
    			create_component(trainingtype.$$.fragment);
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectedlanguage, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(trainingtype, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*setupComponent*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectedlanguage.$$.fragment, local);
    			transition_in(trainingtype.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectedlanguage.$$.fragment, local);
    			transition_out(trainingtype.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectedlanguage, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(trainingtype, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(103:2) {#if $setupMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	const start_1 = new Start({
    			props: { setupOk: /*setupOk*/ ctx[0] },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$setupMode*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(start_1.$$.fragment);
    			t = space();
    			if_block.c();
    			attr_dev(div0, "class", "container main-container svelte-1u4q00c");
    			add_location(div0, file$4, 99, 1, 1811);
    			attr_dev(div1, "class", "hero is-fullheight main svelte-1u4q00c");
    			add_location(div1, file$4, 98, 0, 1772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(start_1, div0, null);
    			append_dev(div0, t);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const start_1_changes = {};
    			if (dirty & /*setupOk*/ 1) start_1_changes.setupOk = /*setupOk*/ ctx[0];
    			start_1.$set(start_1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(start_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(start_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(start_1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $setupMode;
    	validate_store(setupMode, "setupMode");
    	component_subscribe($$self, setupMode, $$value => $$invalidate(4, $setupMode = $$value));
    	let { setupOk, getNextKeys, setupComponent } = oneKey;

    	onDestroy(setupMode.subscribe(value => {
    		if (!value) {
    			start();
    		}
    	}));

    	onDestroy(trainingType.subscribe(value => {
    		if (value == training.selectKeys) {
    			$$invalidate(0, { setupOk, getNextKeys, setupComponent } = oneKey, setupOk, $$invalidate(1, setupComponent));
    		} else {
    			$$invalidate(0, { setupOk, getNextKeys, setupComponent } = randomKey, setupOk, $$invalidate(1, setupComponent));
    		}
    	}));

    	let targetKey;
    	let nextKey;
    	let lastKeys = "";

    	function start() {
    		nextKey = null;
    		next();
    	}

    	function onKey(event) {
    		const key = event.detail;

    		if (key === "backspace") {
    			$$invalidate(3, lastKeys = lastKeys.slice(0, -1));
    		} else if (key.length === 1) {
    			$$invalidate(3, lastKeys += key);
    		}

    		check();
    	}

    	let timer = null;

    	function check() {
    		clearTimeout(timer);

    		timer = setTimeout(
    			() => {
    				timer = null;

    				if (lastKeys == targetKey) {
    					next();
    				}
    			},
    			10
    		);
    	}

    	function next() {
    		$$invalidate(3, lastKeys = "");

    		if (nextKey) {
    			$$invalidate(2, targetKey = nextKey);
    			nextKey = null;
    			return;
    		}

    		$$invalidate(2, [targetKey, nextKey] = getNextKeys(), targetKey);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("setupOk" in $$props) $$invalidate(0, setupOk = $$props.setupOk);
    		if ("getNextKeys" in $$props) getNextKeys = $$props.getNextKeys;
    		if ("setupComponent" in $$props) $$invalidate(1, setupComponent = $$props.setupComponent);
    		if ("targetKey" in $$props) $$invalidate(2, targetKey = $$props.targetKey);
    		if ("nextKey" in $$props) nextKey = $$props.nextKey;
    		if ("lastKeys" in $$props) $$invalidate(3, lastKeys = $$props.lastKeys);
    		if ("timer" in $$props) timer = $$props.timer;
    		if ("$setupMode" in $$props) setupMode.set($setupMode = $$props.$setupMode);
    	};

    	return [setupOk, setupComponent, targetKey, lastKeys, $setupMode, onKey];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
