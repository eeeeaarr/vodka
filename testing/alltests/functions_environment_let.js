//startgnumessage//
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
//endgnumessage//
//testname// functions_environment_let
//startdescription//
/*
test let builtin
*/
//enddescription//
//testspec// |Shift|~|b|i|n|d|Shift|@|x|Shift|#|Shift|Tab|Enter|Shift|~|b|i|n|d|Shift|@|f|1|Enter|Shift|&|Enter|Shift| |Shift|~|l|e|t|Shift|@|x|Shift|#|2|0|Shift|Tab|Shift|~|Shift|+|Shift|@|x|Shift|@|x|Shift|Tab|Tab|Tab|Shift|Enter|Shift|~|b|i|n|d|Shift|@|f|2|Enter|Shift|&|Shift| |Shift|~|l|e|t|Shift|@|x|Enter|Shift|#|1|0|Enter|Shift|Tab|Shift|+|Shift|@|x|Shift|~|f|1|Shift|Tab|Tab|Shift|Tab|Shift|Enter|Shift|~|f|1|Enter|Enter|Shift|~|f|2|Enter|Enter|Shift|@|a|Enter|Backspace|Backspace|z|Backspace|x|Enter|Enter
//starttest//
var harness = require('../testharness');

var testactions = [];

testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyF'});
testactions.push({type:'keyup',code:'KeyF'});
testactions.push({type:'keydown',code:'Digit1'});
testactions.push({type:'keyup',code:'Digit1'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Digit7'});
testactions.push({type:'keyup',code:'Digit7'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit0'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit0'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Equal'});
testactions.push({type:'keyup',code:'Equal'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyF'});
testactions.push({type:'keyup',code:'KeyF'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Digit7'});
testactions.push({type:'keyup',code:'Digit7'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit1'});
testactions.push({type:'keydown',code:'Digit0'});
testactions.push({type:'keyup',code:'Digit1'});
testactions.push({type:'keyup',code:'Digit0'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Equal'});
testactions.push({type:'keyup',code:'Equal'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyF'});
testactions.push({type:'keyup',code:'KeyF'});
testactions.push({type:'keydown',code:'Digit1'});
testactions.push({type:'keyup',code:'Digit1'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyF'});
testactions.push({type:'keyup',code:'KeyF'});
testactions.push({type:'keydown',code:'Digit1'});
testactions.push({type:'keyup',code:'Digit1'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyF'});
testactions.push({type:'keyup',code:'KeyF'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keyup',code:'KeyZ'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'KeyX'});
testactions.push({type:'keyup',code:'KeyX'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});

const experiment_flags = {
"DISABLE_ALERT_ANIMATIONS":true,
"MAX_RENDER_DEPTH":100,
"NO_SPLASH":true,
"V2_INSERTION_LENIENT_DOC_FORMAT":false,
"ASM_RUNTIME":false,
"OLD_ARROW_KEY_TRAVERSAL":false,
"ERRORS_REPLACE":true,
"STATIC_PIPS":true
};
	

harness.runTestWithFlags(testactions, 'direct', experiment_flags);
//endtest//
