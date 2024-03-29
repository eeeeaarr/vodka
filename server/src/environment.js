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


const BUILTIN_ARG_PREFIX = '|';
const UNBOUND = "****UNBOUND****"

import * as Utils from './utils.js';

import { constructFatalError, newTagOrThrowOOM } from './nex/eerror.js'
import { systemState } from './systemstate.js'
import { Tag } from './tag.js'
import { heap } from './heap.js'

/** @module environment */


class Package {
	constructor(name, parent) {
		this.name = name;
		this.parent = parent;
	}
}



/**
 * This class represents a memory space or scope. The entire memory space of the
 * running program is a tree of Environment objects.
 */
class Environment {
	/**
	 * Creates a new environment.
	 * @param {Environment} parentEnv - the parent environment
	 */
	constructor(parentEnv) {
		this.parentEnv = parentEnv;
		this.symbols = {};
		this.currentPackageForBinding = null;
		this.packages = null;
		this.listOfPackagesUsed = null;
		this.references = 0;

		// this.packageKludge = null;
	}

	// setPackageKludge(val) {
	// 	this.packageKludge = val;
	// }

	// getPackageKludge() {
	// 	return this.packageKludge;
	// }

	// hasPackageKludge() {
	// 	return !!this.packageKludge;
	// }

	toString() {
		let r = '';
		for (let name in this.symbols) {
			if (r != '') {
				r += ',';
			}
			r += `${name}=${this.symbols[name]}`;
		}
		return r;
	}

	debug(lvl) {
		if (!lvl) {
			lvl = '';
		}
		for (let name in this.symbols) {
			console.log(`${lvl}${name}=${this.symbols[name].val}`)
		}
		if (this.parentEnv) {
			this.parentEnv.debug(lvl + '  ')
		}
	}

	getParent() {
		return this.parentEnv;
	}

	pushEnv() {
		let env = new Environment(this);
		heap.addEnvReference(this);
		heap.addEnvReference(env);
		return env;
	}

	finalize() {
		heap.removeEnvReference(this);
		heap.removeEnvReference(this.parentEnv);
	}

	cleanUp() {
		for (let name in this.symbols) {
			let val = this.symbols[name];
			heap.removeReference(val);
		}
	}

	// packages:
	// - want to be able to bind "naked" names
	// - if you bind something within a package, then you access that binding with
	//   packagename:binding
	//   unless you do (using packagename)
	// - we want to make it illegal to bind a symbol with : in it so we can restrict
	//   that to just the (package ) builtin

	usePackage(name) {
		if (this.listOfPackagesUsed == null) {
			this.listOfPackagesUsed = [];
		}
		this.listOfPackagesUsed.push(name);
	}

	addPackageNameToKnownPackages(name) {
		if (this.packages == null) {
			this.packages = [];
		}
		this.packages.push(name);
	}

	setPackageForBinding(name) {
		BINDINGS.addPackageNameToKnownPackages(name);
		this.currentPackageForBinding = name;
	}

	getPackageForBinding() {
		return this.currentPackageForBinding;
	}

	isKnownPackageName(name) {
		return this.packages && this.packages.includes(name);
	}

	// should only call on BINDINGS?

	bindInPackage(name, val, packageName) {
		name = packageName + ':' + name;
		this.bind(name, val, packageName);
	}

	normalBind(name, val) {
		this.bind(name, val);
	}

	makeBindingRecord(name, value, packageName) {
		return {
			name: name,
			val: value,
			packageName: packageName
		}
	}

	copyBindingRecord(record) {
		return {
			name: record.name,
			val: record.val,
			packagename: record.packagename
		}
	}

	bind(name, val, packageName) {
		if (this.symbols[name]) {
			heap.removeReference(this.symbols[name].val);
			this.symbols[name].val = val;
			heap.addReference(val);
			this.symbols[name].packageName = packageName; // I guess it's totally unnecessary because you could parse the name.
		} else {
			heap.addReference(val);
			this.symbols[name] = this.makeBindingRecord(name, val, packageName);
		}
		if (val.getTypeName() == '-closure-') {
			val.setSymbolBinding(name);
		}
	}

	// only used by builtins to retrieve args, we can just directly access this env
	lb(name) {
		let nm = BUILTIN_ARG_PREFIX + name;
		if (!this.symbols[nm]) {
			return UNBOUND;
		}
		return this.symbols[nm].val;
	}

	getAllBoundSymbolsAtThisLevel() {
		let r = [];
		let nm = null;
		for (nm in this.symbols) {
			r.push(nm);
		}
		return r;
	}

	doForEachBinding(f) {
		for (let s in this.symbols) {
			let symrec = this.symbols[s];
			f(symrec);
		}
	}

	// private
	_recursiveLookup(name, listOfListOfPackagesUsed) {
		// this can also be a package binding if the person
		// uses the fully qualified name, i.e. @foo:bar
		let nakedBinding = this.symbols[name];
		if (nakedBinding) {
			return nakedBinding;
		};
		// only executes at the BINDINGS level
		if (this.packages) {
			// go through all the lists of used packages provided at all lower levels
			for (let i = 0; i < listOfListOfPackagesUsed.length; i++) {
				let list = listOfListOfPackagesUsed[i];
				if (!list) continue; // can be null
				for (let j = 0; j < list.length; j++) {
					// go through all the packages we are using
					let packageName = list[j];
					// it has to be a valid package name, otherwise "using" would fail.
					let packageBinding = this.symbols[`${packageName}:${name}`];
					if (packageBinding) {
						return packageBinding;
					}						
				}
			}
		}
		if (this.parentEnv) {
			listOfListOfPackagesUsed.push(this.parentEnv.listOfPackagesUsed);
			return this.parentEnv._recursiveLookup(name, listOfListOfPackagesUsed);
		}
		return null;
	}

 	isDereferenceable(n) {
		return n.getTypeName() == '-org-';
	}

	dereference(val, dereferencingPart) {
		if (dereferencingPart.length == 0) {
			return val;
		} else {
			let refName = dereferencingPart[0];
			let thisReferenceTag = newTagOrThrowOOM(refName, 'dereferencing');
			if (!this.isDereferenceable(val)) {
				throw constructFatalError(`cannot dereference this thing: [${val.debugString()}]. Sorry!`);
			}
			let newval = val.getChildWithTag(thisReferenceTag);
			if (!newval) {
				throw constructFatalError(`unknown reference ${refName}. Sorry!`);
			}
			dereferencingPart.shift();
			return this.dereference(newval, dereferencingPart)
		}
	}

	derefToParent(val, dereferencingPart) {
		if (dereferencingPart.length == 1) {
			return {
				'val': val,
				'tag': newTagOrThrowOOM(dereferencingPart[0], 'dereferencing to parent, length 1')
			}
		} else {
			let refName = dereferencingPart[0];
			let thisReferenceTag = newTagOrThrowOOM(refName, 'dereferencing to parent');
			if (!this.isDereferenceable(val)) {
				throw constructFatalError(`cannot dereference this thing: [${val.debugString()}]. Sorry!`);
			}
			let newval = val.getChildWithTag(thisReferenceTag);
			if (!newval) {
				throw constructFatalError(`unknown reference ${refName}. Sorry!`);
			}
			dereferencingPart.shift();
			return this.derefToParent(newval, dereferencingPart)
		}
	}

	// returns the full binding struct
	lookupFullBinding(name) {
		let dereferencingPart = null;
		if (name.indexOf('.') >= 0) {
			dereferencingPart = name.substr(name.indexOf('.') + 1).split('.');
			name = name.substr(0, name.indexOf('.'));
		}
		let binding = this._recursiveLookup(name, [this.listOfPackagesUsed]);
		if (!binding) {
			throw constructFatalError(`undefined symbol: ${name}. Sorry!`);
		}
		binding.val.packageName = binding.packageName;
		if (dereferencingPart) {
			binding = this.copyBindingRecord(binding);
			binding.val = this.dereference(binding.val, dereferencingPart);
		}
		return binding;
	}

	// just returns the value
	lookupBinding(name) {
		return this.lookupFullBinding(name).val;
	}

	// TODO(https://github.com/eeeeaaii/vodka/issues/133)
	hasBinding(name) {
		let binding = this._recursiveLookup(name, [this.listOfPackagesUsed]);
		return !!binding;
	}

	set(name, val, optionalTag) {
		let dereferencingPart = null;
		if (name.indexOf('.') >= 0) {
			dereferencingPart = name.substr(name.indexOf('.') + 1).split('.');
			name = name.substr(0, name.indexOf('.'));
		}
		let binding = this._recursiveLookup(name, [this.listOfPackagesUsed]);
		if (!binding) {
			throw constructFatalError(`undefined symbol: ${name}, cannot set. Sorry!`);
		}
		if (dereferencingPart) {
			let derefSetRecord = this.derefToParent(binding.val, dereferencingPart);
			let v = derefSetRecord.val;
			if (!Utils.isNexContainer(v)) {
				throw constructFatalError('cannot dereference a non-org');
			}
			for (let i = 0; i < v.numChildren(); i++) {
				if (v.getChildAt(i).hasTag(derefSetRecord.tag)) {
					val.addTag(derefSetRecord.tag);
					v.replaceChildAt(val, i);
					return;
				}
			}
			// if we got here, we tried to reference a nonexistant property.
			throw constructFatalError(`unknown reference ${derefSetRecord.tag.getTagString()}. Sorry!`);
		} else {
			binding.val = val;
		}
	}
}

// global lexical environment.
// BUILTINS are implemented in javascript.
// anything bound with (bind ...) goes in BINDINGS.
// any environments nested under that are closures.

/**
 * This is the global built-in lexical environment. All symbols bound here
 * are natively implemented in javascript and are part of the
 * vodka language runtime.
 */
const BUILTINS = new Environment(null);

const BASEPACKAGE = new Package(':', null);

/**
 * This is the global environment for user-bound variables. All symbols
 * bound with the bind primitive are in this scope.
 */
const BINDINGS = BUILTINS.pushEnv();

export { Environment, BUILTINS, BINDINGS, BUILTIN_ARG_PREFIX, UNBOUND, BASEPACKAGE }

