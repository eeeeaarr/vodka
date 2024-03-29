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

import * as Utils from './utils.js';

import { INDENT, systemState } from './systemstate.js'
import { ArgEvaluator } from './argevaluator.js'
import { perfmon, PERFORMANCE_MONITOR } from './perfmon.js'
import { CONSOLE_DEBUG } from './globalconstants.js'
import { experiments } from './globalappflags.js'
import { wrapError } from './evaluator.js'
import { constructFatalError } from './nex/eerror.js'
import { heap, HeapString } from './heap.js'

class Arg {
	constructor(nex) {
		this.nex = nex;
		this.processed = false;
		this.ref = null;
		this.refindex = null;
		this.substituteValue = null;
	}

	makeUpdating(ref, refindex) {
		this.ref = ref;
		this.refindex = refindex;
	}

	isProcessed() {
		return this.processed;
	}

	setProcessed(v) {
		this.processed = v;
	}

	getNexOrSubstitute() {
		if (this.substituteValue) {
			return this.substituteValue;
		} else {
			return this.nex;
		}
	}

	getNex() {
		return this.nex;
	}

	// sometimes we use a different value (settled dv's)
	setSubstituteValue(n) {
		this.substituteValue = n;
	}

	hasSubstituteValue() {
		return this.substituteValue != null;
	}

	setNex(n) {
		this.nex = n;
		if (this.ref) {
			this.ref.replaceChildAt(n, this.refindex);
		} else {
			// being in here counts as a reference...
			heap.addReference(this.nex);
		}
	}

	cleanup() {
		if (!this.ref) {
			heap.removeReference(this.nex);
		}
	}

	debugString() {
		return "|ARG|" + this.nex.debugString();
	}
}

/**
 * The reason you need an arg container is that if you are doing shift-enter
 * evaluation for the purposes of side effects, we don't want to alter the code
 * or change the contents of the command. So we store the args in a separate place
 * and they get evaluated (and replaced) there.
 */
class ArgContainer {
	constructor(nex) {
		this.args = [];
	}

	makeUpdating(ref) {
		for (let i = 0; i < this.args.length; i++) {
			this.args[i].makeUpdating(ref, i);
		}
	}

	cleanup() {
		for (let i = 0; i < this.args.length; i++) {
			this.args[i].cleanup();
		}
	}

	addArg(arg) {
		this.args[this.args.length] = arg;
	}

	numArgs() {
		return this.args.length;
	}

	getArgAt(i) {
		return this.args[i];
	}

	setArgAt(newarg, i) {
		this.args[i] = newarg;
	}

	removeArgAt(i) {
		this.args[i].splice(i, 1);
	}
}

class RunInfo {
	constructor(closure, cmdname, expectedReturnType, argContainer, argEvaluator, commandDebugString, skipAlert, tags, packageName) {
		this.closure = closure;
		heap.addReference(closure);

		this.cmdname = new HeapString(cmdname);

		// expectedReturnType is a struct defined in paramparser
		// it doesn't CURRENTLY contain anything variable-length
		// but might in the future?
		this.expectedReturnType = expectedReturnType;

		// even though a deferred command can hold onto an argcontainer for a long time, I don't need
		// to worry about reference counting because of makeUpdating - basically the arg object
		// will update the children of the deferred command, so as long as the deferred command
		// is in scope, the args will be in scope.
		this.argContainer = argContainer;

		// doesn't contain any memory aside from the arg container.
		this.argEvaluator = argEvaluator;


		this.commandDebugString = commandDebugString.substr(0, 256);
		this.skipAlert = skipAlert;
		this.tags = tags;
		this.packageName = packageName;
	}

	isRunInfo() {
		return true;
	}

	memUsed() {
		return 1500 + this.cmdname.memUsed();
	}

	finalize() {
		heap.removeReference(this.closure);
	}
}

function executeRunInfo(runInfo, executionEnv) {
	let result = runCommand(runInfo, executionEnv);

	if (runInfo.expectedReturnType != null && !Utils.isFatalError(result)) {
		let typeChecksOut = ArgEvaluator.ARG_VALIDATORS[runInfo.expectedReturnType.type](result);
		if (!typeChecksOut) {
			result = constructFatalError(`${runInfo.cmdname.get()}: should return ${runInfo.expectedReturnType.type} but returned ${result.getTypeName()}`);
		}
	}

	return result;
}

function runCommand(runInfo, executionEnv) {
	systemState.pushStackLevel();
	systemState.stackCheck(); // not for step eval, this is to prevent call stack overflow.

	if (CONSOLE_DEBUG) {
		console.log(`${INDENT()}evaluating command: ${runInfo.commandDebugString}`);
		console.log(`${INDENT()}closure is: ${runInfo.closure.debugString()}`);
	}
	// the arg container holds onto the args and is used by the arg evaluator.
	// I think this is useful for step eval but I can't remember

	if (PERFORMANCE_MONITOR) {
		perfmon.logMethodCallStart(runInfo.closure.getSymbolBinding());
	}

	if (!experiments.DISABLE_ALERT_ANIMATIONS && !runInfo.skipAlert) {
		runInfo.closure.doAlertAnimation();
	}

	// actually run the code.
	let r = runInfo.closure.closureExecutor(executionEnv, runInfo.argEvaluator, runInfo.cmdname.get(), runInfo.tags, runInfo.packageName);
	for (let i = 0; i < runInfo.tags.length; i++) {
		// we do the copy here not when the thing does the thing
		r.addTag(runInfo.tags[i].copy())
	}
	runInfo.argContainer.cleanup();
	
	if (PERFORMANCE_MONITOR) {
		perfmon.logMethodCallEnd(runInfo.closure.getSymbolBinding());
	}

	if (CONSOLE_DEBUG) {
		console.log(`${INDENT()}command returned: ${r.debugString()}`);
	}
	systemState.popStackLevel();
	return r;
}


export { ArgContainer, Arg, RunInfo, executeRunInfo }


