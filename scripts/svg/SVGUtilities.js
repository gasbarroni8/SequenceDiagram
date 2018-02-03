define(() => {
	'use strict';

	const NS = 'http://www.w3.org/2000/svg';

	function makeText(text = '') {
		return document.createTextNode(text);
	}

	function make(type, attrs = {}, children = []) {
		const o = document.createElementNS(NS, type);
		for(const k in attrs) {
			if(attrs.hasOwnProperty(k)) {
				o.setAttribute(k, attrs[k]);
			}
		}
		for(const c of children) {
			o.appendChild(c);
		}
		return o;
	}

	function makeContainer(attrs = {}) {
		return make('svg', Object.assign({
			'xmlns': NS,
			'version': '1.1',
		}, attrs));
	}

	function empty(node) {
		while(node.childNodes.length > 0) {
			node.removeChild(node.lastChild);
		}
	}

	return {
		makeText,
		make,
		makeContainer,
		empty,
	};
});
