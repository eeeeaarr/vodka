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

import { Builtin } from '../nex/builtin.js'
import { constructWord } from '../nex/word.js'
import { constructNil } from '../nex/nil.js'
import { constructEError } from '../nex/eerror.js'
import { constructDoc } from '../nex/doc.js' 
import { constructLine } from '../nex/line.js' 
import { constructCommand } from '../nex/command.js' 
import { constructDeferredCommand } from '../nex/deferredcommand.js' 
import { constructLambda } from '../nex/lambda.js' 
import { constructOrg } from '../nex/org.js' 
import { ERROR_TYPE_INFO, ERROR_TYPE_FATAL, ERROR_TYPE_WARN } from '../nex/eerror.js'

function createMakeBuiltins() {

	Builtin.createBuiltin(
		'make-wavetable',
		[],
		function $makeWavetable(env, executionEnvironment) {
			let args = env.lb('nex');
			let r = constructWavetable();
			return r;
		},
		'Creates a new wavetable.'
	);


	Builtin.createBuiltin(
		'make-nil',
		[],
		function $makeNil(env, executionEnvironment) {
			return constructNil();
		},
		'Creates a nil object.'
	);

	Builtin.createBuiltin(
		'make-command',
		['nex...'],
		function $makeCommand(env, executionEnvironment) {
			let args = env.lb('nex');
			let cmd = null;
			for (let i = 0 ; i < args.numChildren(); i++) {
				let arg = args.getChildAt(i);
				// first one could be name of command
				if (i == 0 && arg.getTypeName() == '-symbol-') {
					cmd = constructCommand(arg.getTypedValue())
				} else {
					if (!cmd) {
						cmd = constructCommand();
					}
					cmd.appendChild(arg);
				}
			}
			if (!cmd) {
				cmd = constructCommand();
			}
			return cmd;
		},
		'Creates a new command containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-doc',
		['nex...'],
		function $makeDoc(env, executionEnvironment) {
			let args = env.lb('nex');
			let r = constructDoc();
			for (let i = 0 ; i < args.numChildren(); i++) {
				r.appendChild(args.getChildAt(i));
			}
			return r;
		},
		'Creates a new doc containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-deferred-command',
		[ 'args...' ],
		function $makeDeferredCommand(env, executionEnvironment) {
			let args = env.lb('args');
			let r = constructDeferredCommand();
			for (let i = 0 ; i < args.numChildren(); i++) {
				let c = children.getChildAt(i);
				r.appendChild(c);
			}
			return r;
		},
		'Creates a new deferred command containing |args as children.'
	);

	Builtin.createBuiltin(
		'make-lambda',
		['nex...'],
		function $makeLambda(env, executionEnvironment) {
			let exps = env.lb('nex');
			let r = constructLambda();
			for (let i = 0 ; i < exps.numChildren(); i++) {
				let c = exps.getChildAt(i);
				r.appendChild(c);
			}
			return r;
		},
		'Creates a new lambda containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-line',
		['nex...'],
		function $makeLine(env, executionEnvironment) {
			let args = env.lb('nex');
			let r = constructLine();
			for (let i = 0 ; i < args.numChildren(); i++) {
				r.appendChild(args.getChildAt(i));
			}
			return r;
		},
		'Creates a new line containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-word',
		['nex...'],
		function $makeWord(env, executionEnvironment) {
			let args = env.lb('nex');
			let r = constructWord();
			for (let i = 0 ; i < args.numChildren(); i++) {
				r.appendChild(args.getChildAt(i));
			}
			return r;
		},
		'Creates a new word containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-org',
		['nex...'],
		function $makeOrg(env, executionEnvironment) {
			let args = env.lb('nex');
			let r = constructOrg();
			for (let i = 0 ; i < args.numChildren(); i++) {
				r.appendChild(args.getChildAt(i));
			}
			return r;
		},
		'Creates a new org containing the args as children.'
	);

	Builtin.createBuiltin(
		'make-error',
		['str$'],
		function $makeError(env, executionEnvironment) {
			let str = env.lb('str');
			let r = constructEError(str.getFullTypedValue());
			r.setErrorType(ERROR_TYPE_FATAL);
			r.suppressNextCatch();
			return r;
		},
		'Creates a new (fatal) error with |str as the description.'
	);

	Builtin.createBuiltin(
		'make-warning',
		['str$'],
		function $makeWarning(env, executionEnvironment) {
			let str = env.lb('str');
			let r = constructEError(str.getFullTypedValue());
			r.setErrorType(ERROR_TYPE_WARN);
			return r;
		},
		'Creates a new warning (an error with type WARN) with |str as the description.'
	);

	Builtin.createBuiltin(
		'make-info',
		['str$'],
		function $makeInfo(env, executionEnvironment) {
			let str = env.lb('str');
			let r = constructEError(str.getFullTypedValue());
			r.setErrorType(ERROR_TYPE_INFO);
			return r;
		},
		'Creates a new info (an error with type INFO) with |str as the description.'
	);
}

export { createMakeBuiltins }

