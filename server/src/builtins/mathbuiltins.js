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

import * as Utils from '../utils.js'

import { Builtin } from '../nex/builtin.js'
import { constructFatalError } from '../nex/eerror.js'
import { constructFloat } from '../nex/float.js'
import { constructInteger } from '../nex/integer.js'
import { constructBool } from '../nex/bool.js'
import { UNBOUND } from '../environment.js'


function createMathBuiltins() {

	// minuend - subtrahend

	Builtin.createBuiltin(
		/* minus */ '-',
		[ 'min#%', 'sub#%?' ],
		function $minus(env, executionEnvironment) {
			let a = env.lb('min');
			let b = env.lb('sub');
			if (b == UNBOUND) {
				let n = (-a.getTypedValue());
				if (Utils.isFloat(a)) {
					return constructFloat(n);
				} else {
					return constructInteger(n);
				}
			} else {
				let result = a.getTypedValue() - b.getTypedValue();
				if (Utils.isFloat(a)
						|| Utils.isFloat(b)) {
					return constructFloat(result);
				} else {
					return constructInteger(result);
				}
			}
		},
		'Subtracts |sub from |min and returns the result.',
		true /* is infix */
	);


	Builtin.createBuiltin(
		/* not-equal */ '<>',
		[ 'lhs#%', 'rhs#%' ],
		function $notEqual(env, executionEnvironment) {
			let a = env.lb('lhs').getTypedValue();
			let b = env.lb('rhs').getTypedValue();
			let r = (a != b);
			return constructBool(r);
		},
		'Returns true if |lhs evaluates to a number that is not equal to |rhs.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $plus(env, executionEnvironment) {
		let total = 0;
		let foundFloat = false;
		let ar = env.lb('add');
		for (let i = 0; i < ar.numChildren(); i++) {
			let arg = ar.getChildAt(i);
			if (Utils.isFloat(arg)) {
				foundFloat = true;
			}
			total += arg.getTypedValue();
		}
		let r = foundFloat ? constructFloat(total) : constructInteger(total);
		return r;
	}

	Builtin.createBuiltin(
		/* plus */ '+',
		[ 'add#%...' ],
		$plus,
		'Adds the arguments and returns the result.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $greaterThan(env, executionEnvironment) {
		let a = env.lb('lhs').getTypedValue();
		let b = env.lb('rhs').getTypedValue();
		let r = (a > b);
		return constructBool(r);
	}

	Builtin.createBuiltin(
		/* greater-than */ '>',
		[ 'lhs#%', 'rhs#%' ],
		$greaterThan,
		'Returns true if |lhs evaluates to a number that is strictly greater than |rhs.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $greaterThanOrEqualTo(env, executionEnvironment) {
		let a = env.lb('lhs').getTypedValue();
		let b = env.lb('rhs').getTypedValue();
		let r = (a >= b);
		return constructBool(r);
	}

	Builtin.createBuiltin(
		/* greater-than-or-equal-to */ '>=',
		[ 'lhs#%', 'rhs#%' ],
		$greaterThanOrEqualTo,
		'Returns true if |lhs evaluates to a number that is greater than or equal to |rhs.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $lessThan(env, executionEnvironment) {
		let a = env.lb('lhs').getTypedValue();
		let b = env.lb('rhs').getTypedValue();
		let r = (a < b);
		return constructBool(r);
	}

	Builtin.createBuiltin(
		/* less-than */ '<',
		[ 'lhs#%', 'rhs#%' ],
		$lessThan,
		'Returns true if |lhs evaluates to a number that is strictly less than |rhs.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $lessThanOrEqualTo(env, executionEnvironment) {
		let a = env.lb('lhs').getTypedValue();
		let b = env.lb('rhs').getTypedValue();
		let r = (a <= b);
		return constructBool(r);
	}

	Builtin.createBuiltin(
		/* less-than-or-equal-to */ '<=',
		[ 'lhs#%', 'rhs#%' ],
		$lessThanOrEqualTo,
		'Returns true if |lhs evaluates to a number that is less than or equal to |rhs.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $dividedBy(env, executionEnvironment) {
		let a = env.lb('divid');
		let b = env.lb('divis');
		if (b.getTypedValue() == 0) {
			return constructFatalError('divide: cannot divide by zero, Sorry!');
		}
		let result = a.getTypedValue() / b.getTypedValue();
		if (Utils.isFloat(a)
				|| Utils.isFloat(b)) {
			return constructFloat(result);
		} else {
			return constructInteger(result);
		}
	}

	Builtin.createBuiltin(
		/* divided-by */ '/',
		[ 'divid#%', 'divis#%' ],
		$dividedBy,
		'Divides |divid by |divis and returns the result.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $equals(env, executionEnvironment) {
		let a = env.lb('lhs').getTypedValue();
		let b = env.lb('rhs').getTypedValue();
		let r = (a == b);
		return constructBool(r);
	}

	Builtin.createBuiltin(
		/* equals */ '=',
		[ 'lhs#%', 'rhs#%' ],
		$equals,
		'Returns true if |lhs and |rhs evaluates to numbers that are equal.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $times(env, executionEnvironment) {
		let result = 1;
		let foundFloat = false;
		let ar = env.lb('fact');
		for (let i = 0; i < ar.numChildren(); i++) {
			let arg = ar.getChildAt(i);
			if (Utils.isFloat(arg)) {
				foundFloat = true;
			}
			result *= arg.getTypedValue();
		}
		let r = foundFloat ? constructFloat(result) : constructInteger(result);
		return r;
	}

	Builtin.createBuiltin(
		/* times */ '*',
		[ 'fact#%...' ],
		$times,
		'Multiplies the args and returns the result.',
		true /* is infix */
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $getPi(env, executionEnvironment) {
		return constructFloat(Math.PI);
	}

	Builtin.createBuiltin(
		'get-pi',
		[ ],
		$getPi,
		'Returns pi.'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $getE(env, executionEnvironment) {
		return constructFloat(Math.E);
	}

	Builtin.createBuiltin(
		'get-e',
		[ ],
		$getE,
		'Returns e.'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $acos(env, executionEnvironment) {
		let a = env.lb('arg').getTypedValue();
		let b = Math.acos(a);
		return constructFloat(b);
	}

	Builtin.createBuiltin(
		'acos',
		[ 'arg%' ],
		$acos,
		'Computes the inverse cosine of |arg (the angle whose cosine is |arg)'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $asin(env, executionEnvironment) {
		let a = env.lb('arg').getTypedValue();
		let b = Math.asin(a);
		return constructFloat(b);
	}

	Builtin.createBuiltin(
		'asin',
		[ 'arg%' ],
		$asin,
		'Computes the inverse sine of |arg (the angle whose sine is |arg)'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $atan(env, executionEnvironment) {
		let a = env.lb('arg').getTypedValue();
		let b = Math.atan(a);
		return constructFloat(b);
	}

	Builtin.createBuiltin(
		'atan',
		[ 'arg%' ],
		$atan,
		'Computes the inverse tangent of |arg (the angle whose tangent is |arg)'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $atan2(env, executionEnvironment) {
		let y = env.lb('y').getTypedValue();
		let x = env.lb('x').getTypedValue();
		return constructFloat(Math.atan2(y, x));
	}

	Builtin.createBuiltin(
		'atan2',
		[ 'y%', 'x%' ],
		$atan2,
		'Computes the angle between the x axis and the line to (x, y), in the range from +pi and -pi.'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $ceiling(env, executionEnvironment) {
		let a = env.lb('arg').getTypedValue();
		a = Math.ceil(a);
		return constructFloat(a);
	}

	Builtin.createBuiltin(
		'ceiling',
		[ 'arg%' ],
		$ceiling,
		'Returns the integer ceiling of |arg.'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $cos(env, executionEnvironment) {
		let a = env.lb('arg').getTypedValue();
		let b = Math.cos(a);
		return constructFloat(b);
	}

	Builtin.createBuiltin(
		'cos',
		[ 'arg%' ],
		$cos,
		'Returns the cosine of |arg (adjacent/hypotenuse)'
	);

	// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  

	function $exp(env, executionEnvironment) {
		let a = env.lb('a').getTypedValue();
		return constructFloat(Math.exp(a));
	}

	Builtin.createBuiltin(
		'exp',
		[ 'a%' ],
		$exp,
		'Computes the exponential function of |a (e to the |a).'
	);


	Builtin.createBuiltin(
		'floor',
		[ 'arg%' ],
		function $floor(env, executionEnvironment) {
			let a = env.lb('arg').getTypedValue();
			a = Math.floor(a);
			return constructFloat(a);
		},
		'Computes the integer floor of |arg.'
	);


	// log base e, helps to differentiate
	// from methods that log things
	Builtin.createBuiltin(
		'log-e',
		[ 'a%' ],
		function $logE(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			return constructFloat(Math.log(a));
		},
		'Computes the log base e of |a.'
	);


	Builtin.createBuiltin(
		'log-10',
		[ 'a%' ],
		function $logTen(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			return constructFloat(Math.log10(a));
		},
		'Computes the log base 10 of |a.'
	);


	Builtin.createBuiltin(
		'log-2',
		[ 'a%' ],
		function $logTwo(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			return constructFloat(Math.log2(a));
		},
		'Computes the log base 2 of |a.'
	);


	Builtin.createBuiltin(
		'modulo',
		[ 'divid#', 'modulus#' ],
		function $modulo(env, executionEnvironment) {
			let a = env.lb('divid');
			let b = env.lb('modulus');
			let result = a.getTypedValue() % b.getTypedValue();
			return constructInteger(result);
		},
		'Computes |divid modulo |modulus and returns the result.',
		true /* is infix */
	);


	Builtin.createBuiltin(
		'nth-root',
		[ 'a%', 'b%' ],
		function $nthRoot(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			let b = env.lb('b').getTypedValue();
			return constructFloat(Math.pow(a, (1.0/b)));
		},
		'Computes the |bth root of |a.'
	);


	Builtin.createBuiltin(
		'power',
		[ 'a%', 'b%' ],
		function $power(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			let b = env.lb('b').getTypedValue();
			return constructFloat(Math.pow(a, b));
		},
		'Computes |a to the |b power and returns the result.',
		true /* is infix */
	);


	Builtin.createBuiltin(
		'random',
		[],
		function $random(env, executionEnvironment) {
			let n = Math.random();
			return constructFloat(n);
		},
		'Returns a random number between 0 and 1.'
	);


	Builtin.createBuiltin(
		'round',
		[ 'arg%' ],
		function $round(env, executionEnvironment) {
			let a = env.lb('arg').getTypedValue();
			a = Math.round(a);
			return constructFloat(a);
		},
		'Return |arg rounded to the nearest integer.'
	);


	Builtin.createBuiltin(
		'sin',
		[ 'arg%' ],
		function $sin(env, executionEnvironment) {
			let a = env.lb('arg').getTypedValue();
			let b = Math.sin(a);
			return constructFloat(b);
		},
		'Computes the sin (opposite/hypotenuse) of |arg.'
	);


	Builtin.createBuiltin(
		'square-root',
		[ 'a%' ],
		function $squareRoot(env, executionEnvironment) {
			let a = env.lb('a').getTypedValue();
			return constructFloat(Math.sqrt(a));
		},
		'Computes the square root of |a.'
	);


	Builtin.createBuiltin(
		'tan',
		[ 'arg%' ],
		function $tan(env, executionEnvironment) {
			let a = env.lb('arg').getTypedValue();
			let b = Math.tan(a);
			return constructFloat(b);
		},
		'Computes the tangent (opposite/adjacent) of |arg.'
	);
}

export { createMathBuiltins }

