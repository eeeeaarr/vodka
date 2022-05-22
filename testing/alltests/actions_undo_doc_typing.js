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
//testname// actions_undo_doc_typing
//startdescription//
/*
undo standard doc typing
*/
//enddescription//
//testspec// |Shift|{|a|p|p|l|e|s| |a|r|e| |g|r|e|a|t|.|Enter|Shift|I| |p|e|r|o|n|Backspace|Backspace|s|o|n|a|l|l|y| |t|h|i|n|g|Enter|t|h|a|t| |t|h|e| |Backspace|y| |a|r|e|Enter|g|r|e|a|t|.|Enter|Enter|Shift|?|Enter|y|o|u|Shift|?|Meta|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z|z
//starttest//
var harness = require('../testharness');

var testactions = [];

testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'BracketLeft'});
testactions.push({type:'keyup',code:'BracketLeft'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyP'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyP'});
testactions.push({type:'keydown',code:'KeyP'});
testactions.push({type:'keyup',code:'KeyP'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyG'});
testactions.push({type:'keyup',code:'KeyG'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'Period'});
testactions.push({type:'keyup',code:'Period'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keydown',code:'KeyP'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyP'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyO'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyO'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'KeyS'});
testactions.push({type:'keyup',code:'KeyS'});
testactions.push({type:'keydown',code:'KeyO'});
testactions.push({type:'keyup',code:'KeyO'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyY'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keyup',code:'KeyY'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyH'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyH'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyG'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyG'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyH'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyH'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyH'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyH'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'KeyY'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyY'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'KeyG'});
testactions.push({type:'keyup',code:'KeyG'});
testactions.push({type:'keydown',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyR'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyT'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyT'});
testactions.push({type:'keydown',code:'Period'});
testactions.push({type:'keyup',code:'Period'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Slash'});
testactions.push({type:'keyup',code:'Slash'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});
testactions.push({type:'keydown',code:'KeyY'});
testactions.push({type:'keydown',code:'KeyO'});
testactions.push({type:'keyup',code:'KeyY'});
testactions.push({type:'keydown',code:'KeyU'});
testactions.push({type:'keyup',code:'KeyO'});
testactions.push({type:'keyup',code:'KeyU'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Slash'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keyup',code:'Slash'});
testactions.push({type:'keydown',code:'MetaRight'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keydown',code:'KeyZ'});
testactions.push({type:'keyup',code:'MetaRight'});

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
