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
//testname//  graphics_command_vertical
//startdescription//
/*
tests the visual styling of vertically-oriented commands and lambdas
*/
//enddescription//
//testspec// |Shift|~|Shift|+|Tab|Shift|#|Shift|#|#|#|Shift|Tab|Shift|~|Shift|+|Tab|Shift|#|#|#|2|3|4|3|4|2|3|4|2|3|4|2|3|4|Shift|Tab|Shift| |Shift|~|Backspace|Shift|&| |a| |b| |c| |d|Tab|Shift|#|#|#|#|#|#|Shift|Tab|Shift|&| |a| |b| |c| |d|Tab|Shift|#|#|#|#|#|Tab|Shift| 
//starttest//
var harness = require('../testharness');
var testactions = [];
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Equal'});
testactions.push({type:'keyup',code:'Equal'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
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
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'Digit2'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit4'});
testactions.push({type:'keyup',code:'Digit2'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit4'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'Backspace'});
testactions.push({type:'keyup',code:'Backspace'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Digit7'});
testactions.push({type:'keyup',code:'Digit7'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyC'});
testactions.push({type:'keyup',code:'KeyC'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Digit7'});
testactions.push({type:'keyup',code:'Digit7'});
testactions.push({type:'keyup',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyC'});
testactions.push({type:'keyup',code:'KeyC'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Digit3'});
testactions.push({type:'keyup',code:'Digit3'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'ShiftLeft'});
testactions.push({type:'keydown',code:'Space'});
testactions.push({type:'keyup',code:'Space'});
testactions.push({type:'keyup',code:'ShiftLeft'});

const experiment_flags = {
"V2_INSERTION_LENIENT_DOC_FORMAT":true,
"NO_COPY_CSS":true,
"DISABLE_ALERT_ANIMATIONS":true,
"BETTER_KEYBINDINGS":true,
"MAX_RENDER_DEPTH":100,
"NO_SPLASH":true,
"REMAINING_EDITORS":true,
"CAN_HAVE_EMPTY_ROOT":true,
"NEW_CLOSURE_DISPLAY":true,
"THE_GREAT_MAC_WINDOWS_OPTION_CTRL_SWITCHAROO":true,
"SAVE_EVALUATES_CONTENTS":true
};

harness.runTestWithFlags(testactions, 'direct', experiment_flags);
//endtest//
