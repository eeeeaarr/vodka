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

import { ContextType, ContextMapBuilder } from '../contexttype.js'
import { Nex } from './nex.js'
import { otherflags } from '../globalappflags.js'
import { RENDER_FLAG_INSERT_AFTER } from '../globalconstants.js'
import { parametricFontManager } from '../pfonts/pfontmanager.js'
import { experiments } from '../globalappflags.js'
import { heap } from '../heap.js'
import { constructFatalError } from './eerror.js'

class Letter extends Nex {
	constructor(letter) {
		super();
		this.letterValue = letter;
		if (otherflags.DEFAULT_TO_PARAMETRIC_FONTS) {
			this.pfont = parametricFontManager.getFont('Basic', {}, {});	
			this.pfont.setLetter(this.letterValue);		
		} else {
			this.pfont = null;
		}
		if (letter == '') {
			throw new Error('cannot have an empty letter');
		}
	}

	getTypeName() {
		return '-letter-';
	}

	makeCopy() {
		let r = constructLetter(this.letterValue);
		this.copyFieldsTo(r);
		return r;
	}

	copyFieldsTo(nex) {
		super.copyFieldsTo(nex);
		if (this.pfont) {
			nex.pfont = this.pfont.copy();
		}
	}

	setPfont(pfstring) {
		if (this.pfont && parametricFontManager.isSameFont(this.pfont, pfstring)) {
			parametricFontManager.redrawFontStringInFont(this.pfont, pfstring);
		} else {
			this.pfont = parametricFontManager.getFontForString(pfstring);
			this.pfont.setLetter(this.letterValue);		
		}
		this.setDirtyForRendering(true);
	}

	toString(version) {
		if (version == 'v2') {
			return this.toStringV2();
		}
		return '|(' + this.letterValue + ')|';
	}

	toStringV2() {
		return `[${this.toStringV2Literal()}letter]${this.toStringV2PrivateDataSection()}${this.toStringV2TagList()}`
	}

	serializePrivateData(data) {
		let style = this.getCurrentStyle();
		if (style) {
			return `${this.letterValue}|${this.getCurrentStyle()}`;
		} else {
			return `${this.letterValue}`;
		}
	}

	deserializePrivateData(data) {
		let a = data.split('|');
		this.letterValue = a[0];
		if (a.length > 1) {
			this.setCurrentStyle(a[1]);
		}
	}

	renderInto(renderNode, renderFlags, withEditor) {
		let domNode = renderNode.getDomNode();
		super.renderInto(renderNode, renderFlags, withEditor);
		domNode.classList.add('letter');
		domNode.classList.add('data');
		if (renderFlags & RENDER_FLAG_INSERT_AFTER) {
			domNode.classList.add('rightinsert');
		} else {
			domNode.classList.add('leftinsert');			
		}
		if (this.pfont) {
			domNode.appendChild(this.pfont.drawIntoDomNode(this.letterValue));
		} else {
			let contents = (this.letterValue == " " || this.letterValue == "&nbsp;") ? "\xa0" : this.letterValue;
			domNode.appendChild(document.createTextNode(contents));
		}
	}

	getText() {
		return this.letterValue;
	}

	getDefaultHandler() {
		return 'letterDefault';
	}

	getEventTable(context) {
		return {
			'Tab': 'move-to-next-leaf',
			'ArrowUp': 'move-to-corresponding-letter-in-previous-line',
			'ArrowDown': 'move-to-corresponding-letter-in-next-line',
			'ArrowLeft': 'move-to-previous-leaf',
			'ArrowRight': 'move-to-next-leaf',
			'Backspace' : 'delete-letter',
			'ShiftBackspace' : 'delete-letter',
			'Enter': 'do-line-break-for-letter',

			'!': 'insert-actual-!-at-insertion-point-from-letter',
			'@': 'insert-actual-@-at-insertion-point-from-letter',
			'#': 'insert-actual-#-at-insertion-point-from-letter',
			'$': 'insert-actual-$-at-insertion-point-from-letter',
			'%': 'insert-actual-%-at-insertion-point-from-letter',
			'^': 'insert-actual-^-at-insertion-point-from-letter',
			'&': 'insert-actual-&-at-insertion-point-from-letter',
			'*': 'insert-actual-*-at-insertion-point-from-letter',
			'(': 'insert-actual-(-at-insertion-point-from-letter',
			')': 'insert-actual-)-at-insertion-point-from-letter',
			'[': 'insert-actual-[-at-insertion-point-from-letter',
			'{': 'insert-actual-{-at-insertion-point-from-letter',
			'<': 'insert-actual-<-at-insertion-point-from-letter',
		}
	}


	memUsed() {
		return super.memUsed() + heap.sizeLetter();
	}
}

function constructLetter(letter) {
	if (!heap.requestMem(heap.sizeLetter())) {
		throw constructFatalError(`OUT OF MEMORY: cannot allocate Letter.
stats: ${heap.stats()}`)
	}
	return heap.register(new Letter(letter));
}


export { Letter, constructLetter }

