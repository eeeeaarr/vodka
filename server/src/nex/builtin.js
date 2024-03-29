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

import { Lambda } from './lambda.js'
import { ParamParser } from '../paramparser.js'
import { BUILTINS } from '../environment.js'
import { PERFORMANCE_MONITOR, perfmon } from '../perfmon.js'
import { experiments } from '../globalappflags.js'
import { documentBuiltin } from '../documentation.js'
import { heap, HeapString } from '../heap.js'
import { throwOOM } from './eerror.js'

/**
 * Nex that represents an *uncompiled* builtin function. Compiled builtins
 * are represented by {@link Closure} objects, same as compiled {@link Lambda}s.
 */
class Builtin extends Lambda {
	constructor(name, params, retval, docstring) {
		// memory ok

		super();
		// TODO: accurate memory tracking for builtins
		// since users can't create builtins this is lower priority
		this.name = new HeapString();
		this.name.set(name);
		this.paramsArray = params;
		this.returnValueParam = retval;
		this.internaljs = null;
		this.docstring = new HeapString();
		this.docstring.set(docstring ? docstring : ' - no docs - ');
		this.infix = false;
		let amp = '';
		for (let i = 0; i < params.length; i++) {
			if (amp != '') {
				amp += ' ';
			}
			amp += params[i].name;
		}
		this.amptext = new HeapString();
		this.amptext.set(amp);
		this.f = null;
		this.closure = BUILTINS;
	}

	toString(version) {
		if (version == 'v2') {
			return `[BUILTIN:${this.name.get()}]`;
		}
		return `[BUILTIN:${this.name.get()}]`;
	}

	getCanonicalName() {
		return this.name.get();
	}

	getTypeName() {
		return '-builtin-';
	}

	setInternalJs(js) {
		this.internaljs = js;
	}

	makeCopy(shallow) {
		let r = constructBuiltin(this.name.get(), this.paramsArray);
		this.copyChildrenTo(r, shallow);
		this.copyFieldsTo(r);
		return r;
	}

	getSymbolForCodespan() {
		return '&szlig;';
	}

	getDocString() {
		return this.docstring.get();
	}

	renderInto(renderNode, renderFlags, withEditor) {
		let domNode = renderNode.getDomNode();
		super.renderInto(renderNode, renderFlags, withEditor);
		domNode.classList.add('builtin');
	}

	setF(f) {
		this.f = f.bind(this);
	}

	isInfix() {
		return this.infix;
	}

	setInfix(v) {
		this.infix = v;
	}

	prettyPrintInternal(lvl, hdir) {
		return ` [&]${this.toStringV2PrivateDataSection()}${this.toStringV2TagList()}`;// exp \n`;
	}

	evaluate(executionEnvironment) {
		let r = super.evaluate(executionEnvironment);
		r.setSymbolBinding(this.name.get());
		return r;
	}

	static createBuiltin(name, paramsArray, f, docstring, infix) {
		let parser = new ParamParser(true /* isBuiltin */);
		parser.parse(paramsArray);
		let params = parser.getParams();
		let retval = parser.getReturnValue();
		// technically this could throw an exception but if you getting OOM
		// before you've even created the builtins you're not using Vodka today
		let builtin = constructBuiltin(name, params, retval, docstring);
		if (PERFORMANCE_MONITOR) {
			perfmon.registerMethod(name);
		}
		builtin.setF(f);
		builtin.setInfix(!!infix);
		let closure = builtin.evaluate(BUILTINS);
		// rip out the copied closure and replace with global env because
		// builtins (though they typically do not evaluate each other)
		// still should be mutally able to see each other, much like
		// stuff in a package.
		closure.setLexicalEnvironment(BUILTINS);
		Builtin.bindBuiltinObject(name, closure);
		documentBuiltin(name, paramsArray, docstring);
	}

	static aliasBuiltin(aliasName, boundName) {
		// temporarily a no-op because this messes up autocomplete
		let bound = BUILTINS.lookupBinding(boundName);
		Builtin.bindBuiltinObject(aliasName, bound);
	}

	static bindBuiltinObject(name, nex) {
		BUILTINS.bind(name, nex);
	}

	getEventTable(context) {
		return null;
	}

	memUsed() {
		return super.memUsed() + heap.sizeBuiltin();
	}
}

function constructBuiltin(name, params, retval, docstring) {
	heap.requestMem(heap.sizeBuiltin()) || throwOOM('Builtin');
	return heap.register(new Builtin(name, params, retval, docstring));
}


export { Builtin, constructBuiltin }
