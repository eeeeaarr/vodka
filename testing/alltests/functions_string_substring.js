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
//testname// functions_string_substring
//startdescription//
/*
substring
*/
//enddescription//
//testspec// |Shift|~|s|t|r|i|n|g|-|s|u|b|s|t|r|i|n|g|Enter|Shift|$|a|p|p|l|e|s|Tab|Enter|Shift|#|1|Shift|#|3|Shift|Tab|Enter
//starttest//
var harness = require('../testharness');

var testactions = [];

testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyG'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyG'});
testactions.push({type:'keydown',code:'Minus'});
testactions.push({type:'keyup',code:'Minus'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keydown',code:'KeyU'});
testactions.push({type:'keyup',code:'KeyU'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyG'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyG'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyP'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyP'});
testactions.push({type:'keydown',code:'KeyP'});
testactions.push({type:'keyup',code:'KeyP'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit1'});
testactions.push({type:'keyup',code:'Digit1'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
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
