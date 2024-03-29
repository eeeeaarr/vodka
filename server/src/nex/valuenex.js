/*
This file is part of Vodka.

Vodka is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Vodka is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Vodka.  If not, see <https://www.gnu.org/licenses/>.
*/

import { experiments } from '../globalappflags.js'
import { Nex } from './nex.js'
import { heap, HeapString } from '../heap.js'

class ValueNex extends Nex {
	constructor(val, prefix, className) {
		super();
		if (experiments.ASM_RUNTIME) {
			this.wasmSetup();
		}
		this.value = new HeapString();
		this.setValue(String(val));
		this.prefix = prefix;
		this.className = className;
	}

	getRuntimeId() {
		return this.runtimeId;
	}

	isEmpty() {
		return this.setValue('');
	}

	toString() {
		return '' + this.prefix + this.getValue();
	}

	renderValue() {
		return this.getValue();
	}

	evaluate(env) {
		let r = super.evaluate(env);
		r.setMutable(false);
		return r;
	}

	escapedRenderValue() {
		return this.escape(this.renderValue());
	}

	renderInto(renderNode, renderFlags, withEditor) {
		let domNode = renderNode.getDomNode();
		super.renderInto(renderNode, renderFlags, withEditor);
		domNode.classList.add(this.className);
		domNode.classList.add('valuenex');
		let val = this.escapedRenderValue();
		let inner = '';
		let leftspan = '<span class="glyphleft">' + this.prefix + '</span>'
		let faintleftdot = '<span class="tilde glyphleft faint">·</span>';
		let rightspan = '<span class="glyphright">' + this.prefix + '</span>'
		if (this.isEditing) {
			inner = '' + leftspan + this.escapedRenderValue();
		} else {
			inner = '' + faintleftdot + this.escapedRenderValue() + rightspan;
		}
		domNode.innerHTML = inner;
	}

	getTypedValue() {
		return this.getValue();
	}

	wasmSetup() {}

	setValue(v) {
		this.value.set(v);
		this.setDirtyForRendering(true);
	}

	getValue() {
		return this.value.get();
	}

	appendText(txt) {
		let v = this.getValue();
		v = v + txt;
		this.setValue(v);
		this.setDirtyForRendering(true);
	}

	deleteLastLetter() {
		let v = this.getValue();
		if (v == '') return;
		v = v.substr(0, v.length - 1);
		this.setValue(v);
		this.setDirtyForRendering(true);
	}

	memUsed() {
		return super.memUsed() + this.value.memUsed();
	}
}




export { ValueNex }

