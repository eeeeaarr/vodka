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

import { Nex } from './nex.js'
import { experiments } from '../globalappflags.js'
import { startAuditioningBuffer, getFileAsBuffer } from '../webaudio.js'
import { possiblyRecordAction } from '../testrecorder.js'
import { heap } from '../heap.js'
import { constructFatalError, throwOOM } from './eerror.js'


import { setGlobalPixelsPerSample,
		 getGlobalPixelsPerSample,
		 setGlobalHeightPixelsFullScale,
		 getGlobalHeightPixelsFullScale,
		 getSampleRate,
		 convertSamplesToTimebase,
		 getTimebaseSuffix,
		 getDefaultTimebase } from '../wavetablefunctions.js'

import { eventQueueDispatcher } from '../eventqueuedispatcher.js'
import { showManipulator } from '../wtmanip.js'
import { Editor } from '../editors.js'
import { doTutorial } from '../help.js'
import { getAudioBufferFromData, startRecordingAudio, stopRecordingAudio } from '../webaudio.js'


// zoom essentially means a number of pixels equals a number of samples

// sc sample rate is 48k samples/sec
// let's say I want 440 hz
// I want to know how many samples are in one cycle
// it's 48k/440
//
// to get 

/**
 * Nex that represents a wavetable value.
 */
class Wavetable extends Nex {
	constructor(initSize) {
		super();
		doTutorial('wavetable');

		// sometimes you get an EnterUp event
		// when you first create a wavetable nex so
		// you need to ignore it if you're not auditioning.
		this.auditioning = false;
		this.windowOriginSample = 0;

		this.sections = [];
		this.cachedBuffer = null;
		this.localPixelsPerSample = -1;
		this.localHeightPixelsFullScale = -1;
		this.centerSample = -1;
		this.markers = [];
		this.sectionBeingAuditioned = null;
		this.recording = false;
		this.blobs = [];
		this.currentTimebase = null;
		this.rightIsClipping = false;

		if (!initSize) initSize = 256;
		let d = new Float32Array(initSize);
		d.fill(0);
		this.initWith(d);
	}

	getCurrentTimebase() {
		if (!this.currentTimebase) {
			this.currentTimebase = getDefaultTimebase();
		}
		return this.currentTimebase;
	}

	advanceToNextTimebase() {
		switch(this.currentTimebase) {
			case 'NOTE':
				this.currentTimebase ='SECONDS';
				return;
			case 'SECONDS':
				this.currentTimebase ='HZ';
				return;
			case 'HZ':
				this.currentTimebase ='BEATS';
				return;
			case 'BEATS':
				this.currentTimebase ='SAMPLES';
				return;
			case 'SAMPLES':
				this.currentTimebase ='NOTE';
				return;
		}
	}

	addBlob(blob) {
		this.blobs.push(blob);
	}

	getBlobsAsOneBlob(blob) {
		return new Blob(this.blobs);
	}

	resetBlobs() {
		this.blobs = [];
	}

	isRecording() {
		return this.recording;
	}

	startRecording() {
		this.data = new Float32Array();
		this.resetBlobs();
		this.recording = true;
	}

	stopRecording() {
		this.recording = false;
		this.setDirtyForRendering(true);
		eventQueueDispatcher.enqueueTopLevelRender();			
	}

	setRecordedData(buf) {
		this.data = Float32Array.from(buf);
		this.cacheValues();
		this.setDirtyForRendering(true);
		eventQueueDispatcher.enqueueTopLevelRender();			
	}

	startEditing() {
		this.centerSample = 0;
		this.localPixelsPerSample = getGlobalPixelsPerSample();
		this.localHeightPixelsFullScale = getGlobalHeightPixelsFullScale();

	}

	stopEditing() {
		this.centerSample = -1;
		this.localPixelsPerSample = -1;
		this.localHeightPixelsFullScale = -1;
		this.windowOriginSample = 0;
	}

	addMarker() {
		// we don't want markers at the extreme ends, because then when you slice
		// you get empty wavetables.
		if (this.centerSample < 1 || this.centerSample > this.data.length - 1) {
			return;
		}
		this.markers.push(this.centerSample);
		this.markers = this.markers.sort((a, b) => { return a - b; })
		this.cacheSections();
		eventQueueDispatcher.enqueueTopLevelRender();			
	}

	deleteMarker(i) {
		this.markers.splice(i, 1);
		eventQueueDispatcher.enqueueTopLevelRender();			
	}

	getData() {
		return this.data;
	}

	getCachedBuffer() {
		return this.cachedBuffer;
	}

	getPixelsPerSample() {
		if (this.localPixelsPerSample > -1) {
			return this.localPixelsPerSample;
		} else {
			return getGlobalPixelsPerSample();
		}
	}

	setPixelsPerSample(val) {
		if (this.localPixelsPerSample > -1) {
			this.localPixelsPerSample = val;
		} else {
			setGlobalPixelsPerSample(val);
		}
	}

	getHeightPixelsFullScale() {
		if (this.localHeightPixelsFullScale > -1) {
			return this.localHeightPixelsFullScale;
		} else {
			return getGlobalHeightPixelsFullScale();
		}
	}

	setHeightPixelsFullScale(val) {
		if (this.localHeightPixelsFullScale > -1) {
			this.localHeightPixelsFullScale = val;
		} else {
			setGlobalHeightPixelsFullScale(val);
		}
	}

	windowWidth() {
		let width = this.data.length * this.getPixelsPerSample();
		if (width > screen.width * 0.65) {
			width = screen.width * 0.65;
			this.rightIsClipping = true;
		} else {
			this.rightIsClipping = false;
		}
		return width;
	}

	getDuration() {
		return this.data.length;
	}

	windowHeight() {
		let maxamp = Math.max(this.amp, 1);
		// we just don't want a window larger than 1000 pixels, it'll crash things
		return Math.min(2 * maxamp * this.getHeightPixelsFullScale(), 1000);
	}

	setDataAt(d, i) {
		this.data[i] = d;
	}

	setData(d) {
		this.data = d;
		this.setDirtyForRendering(true);
	}

	// this makes sure you don't set the window origin to be less than zero
	// or large enough that empty space appears to the right of the sample
	setWindowOriginSample(n) {
		let samplesInWindow = this.windowWidth() / this.getPixelsPerSample();
		let minOrigin = 0;
		let maxOrigin = this.data.length - 1 - samplesInWindow;
		this.windowOriginSample = Math.max(minOrigin, Math.min(n, maxOrigin))
	}

	// still needed for cases like for example loading data from a file
	initWith(newdata) {
		// basically if newdata is too huge we could crash
		this.data = new Float32Array(newdata.length);
		for (let i = 0; i < newdata.length; i++) {
			this.data[i] = newdata[i];
		}
		this.cacheValues();
	}

	init() {
		this.cacheValues();		
	}

	// loadFromFile(fname) {
	// 	let t = this;
	// 	getFileAsBuffer(fname).then(function(result) {
	// 		// getChannelData returns a float32 array but it still works
	// 		// TODO: this class stores an audio buffer
	// 		t.initWith(result.getChannelData(0));
	// 		eventQueueDispatcher.enqueueTopLevelRender();
	// 	})

	// }

	cacheValues() {
		let mm = this.getMinMaxInDataRange(0, this.data.length);
		let absMin = Math.abs(mm.min);
		this.setAmp(Math.max(absMin, mm.max));
		this.cachedBuffer = getAudioBufferFromData(this.data);
	}

	getMinMaxInDataRange(start, end) {
		let min = this.data[start];
		let max = this.data[start];
		for (let i = start ; i < end; i++) {
			let data = this.data[i];
			if (data > max) {
				max = data;
			}
			if (data < min) {
				min = data;
			}
		}
		return {
			min: min,
			max: max
		};
	}

	valueAtSample(t) {
		return this.data[t % this.data.length];
	}

	interpolatedValueAtSample(t) {
		if (Math.round(t) == t) {
			while(t < 0) t += this.data.length;
			return this.data[t % this.data.length];
		} else {
			let t1 = Math.floor(t);
			let t2 = Math.ceil(t);
			let t0 = t1 - 1;
			let t3 = t2 + 1;

			// js doesn't really take the modulus of negative values the way we need it to
			while (t0 < 0) t0 += this.data.length;
			while (t1 < 0) t1 += this.data.length;
			while (t2 < 0) t2 += this.data.length;
			while (t3 < 0) t3 += this.data.length;

			let x0 = this.data[t0 % this.data.length]
			let x1 = this.data[t1 % this.data.length]
			let x2 = this.data[t2 % this.data.length]
			let x3 = this.data[t3 % this.data.length]

			let a0 = x3 - x2 - x0 + x1;
			let a1 = x0 - x1 - a0;
			let a2 = x2 - x0;
			let a3 = x1;

			let pos = t - t1;

			return a0 * Math.pow(pos, 3) + a1 * Math.pow(pos, 2) + a2 * pos + a3;
		}
	}

	yPositionOfWaveValue(v) {
		let scaled = v * this.getHeightPixelsFullScale();
		// window height is >= 2*HEIGHT_PIXELS_FULL_SCALE
		// zero is always in the middle
		let wh = this.windowHeight();
		// also  y values are flipped (zero is upper left)
		return (-scaled) + wh/2;
	}

	xPositionOfSampleNumber(n) {
		let sampInWindow = n - this.windowOriginSample;
		return sampInWindow * this.getPixelsPerSample();
	}

	getTypeName() {
		return '-wavetable-';
	}

	setAmp(n) {
		this.amp = n;
	}

	getAmp() {
		return this.amp;
	}

	makeCopy() {
		let r = constructWavetable(this.data.length);
		this.copyFieldsTo(r);
		return r;
	}

	copyFieldsTo(nex) {
		super.copyFieldsTo(nex);
		nex.initWith(this.data);
		nex.currentTimebase = this.currentTimebase;
		for (let i = 0; i < this.markers.length; i++) {
			nex.markers[i] = this.markers[i];
		}
		nex.cacheSections();
	}

	toString(version) {
		if (version == 'v2') {
			return this.toStringV2();
		}
		return '_[wavetable]';
	}

	toStringV2() {
		return `[${this.toStringV2Literal()}wavetable]${this.toStringV2PrivateDataSection()}${this.toStringV2TagList()}`

	}

	deserializePrivateData(data) {
		// I don't know when this gets called?
		let s = window.atob(data);
		let len = s.length;
		let bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = s.charCodeAt(i);
		}
		this.data = new Float32Array(bytes.buffer);
		heap.requestMem(this.data.length * heap.incrementalSizeWavetable());
		this.init();
		// let sa = data.split(',');
		// let d = [];
		// for (let i = 0; i < sa.length; i++) {
		// 	d[i] = Number(sa[i]);
		// }
		// this.initWith(d);
	}

	serializePrivateData() {
		let s = '';
		let bytes = new Uint8Array(this.data.buffer);
		let len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			s += String.fromCharCode(bytes[i]);
		}
		return window.btoa(s);
		// let s = '';
		// for (let i = 0; i < this.data.length; i++) {
		// 	if (s != '') {
		// 		s += ',';
		// 	}
		// 	s += this.data[i];
		// }
		// return s;
	}

	getDefaultHandler() {
		return 'standardDefault';
	}

	auditionSection(n) {
		if ('' + n === '0') {
			this.auditionWave();
			return;
		}
		if (this.markers.length == 0) {
			return;
		}
		n = Number(n);
		// internally section numbers are zero based
		// even though users use one-based numbering to audition them
		n--;
		let sd = this.getSectionData(n);
		if (sd) {
			if (!this.auditioning) {
				this.auditioning = true;
				this.sectionBeingAuditioned = sd;
				startAuditioningBuffer(sd.cachedBuffer, this);
			}
		}
	}

	numSections() {
		return this.markers.length + 1;
	}

	getSectionData(n) {
		// this is off by one city

		// if (n > this.markers.length) {
		// 	return null;
		// }

		// let start = 0;
		// let end = this.data.length;

		// if (n > 0) {
		// 	start = this.markers[n - 1];
		// }
		// if (n < this.markers.length) {
		// 	end = this.markers[n];
		// }

		// let sectiondata = [];
		// for (let i = start ; i < end ; i++) {
		// 	sectiondata[i - start] = this.data[i];
		// }
		return this.sections[n];
		// return {
		// 	start: start,
		// 	end: end,
		// 	data: this.sectiondata[n]
		// }
	}

	cacheSections() {
		for (let i = 0; i < this.sections.length; i++) {
			heap.freeMem(this.sections[i].data.length * heap.incrementalSizeWavetable());
		}
		this.sections = [];
		for (let i = 0; i <= this.markers.length; i++) {
			let start = (i == 0) ? 0 : this.markers[i - 1];
			let end = (i == this.markers.length) ? this.data.length : this.markers[i];
			let k = 0;
			this.sections[i] = {
				start: start,
				end: end,
				data: []
			};
			let sizeReq = (end - start) * heap.incrementalSizeWavetable();
			if (!heap.requestMem(sizeReq)) {
				throwOOM(sizeReq);
			}
			for (let j = start; j < end ; j++) {
				this.sections[i].data[k] = this.data[j];
				k++;
			}
			this.sections[i].cachedBuffer = getAudioBufferFromData(this.sections[i].data);
		}
	}


	auditionWave() {
		if (!this.auditioning) {
			this.auditioning = true;
			startAuditioningBuffer(this.cachedBuffer, this);
		}
	}

	stopAuditioningWave() {
		if (this.auditioning) {
			this.auditioning = false;
			this.sectionBeingAuditioned = null;
			this.setDirtyForRendering(true);
			eventQueueDispatcher.enqueueTopLevelRender();			
		}
	}

	_setClickHandler(renderNode) {
		let starty = 0;
		let startx = 0;
		let initialZoom = 0;
		let initialAmpZoom = 0;
		let y = 0;
		let x = 0;
		let t = this;
		let startedBelow = false;
		let ampnegative = 1;
		let startfunction = (event) => {
			if (event.shiftKey) {
				this.doingAmplitudeZoom = true;
			} else {
				this.doingAmplitudeZoom = false;
			}
			starty = event.clientY;
			startx = event.clientX;
			// the wavecontrols section at the top of the rendered wavetable
			// is about 18px at normal scale but what about zoom? idk.
			let yPositionInWaveDisplay = starty + 18;
			if (starty > this.windowHeight() / 2) {
				startedBelow = true;
			}
			if (this.windowHeight() == 1000) {
				ampnegative = startedBelow ? 1 : -1;
			}
			if (this.isEditing) {
				this.changeCenterSample(event.offsetX);
			}
			initialZoom = this.getPixelsPerSample();
			initialAmpZoom = this.getHeightPixelsFullScale();
			// enqueue a redraw for the center line
			eventQueueDispatcher.enqueueTopLevelRender();			
		}
		let movefunction = (e) => {
			let y = e.clientY;
			let x = e.clientX;
			let deltaY = y - starty;
			let deltaX = -(x - startx);
			let delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;
			let factor = Math.pow(2, -(delta * 0.01));
			let ampfactor = Math.pow(2, ampnegative * (deltaY * 0.01));
			if (this.doingAmplitudeZoom) {
				this.setHeightPixelsFullScale(initialAmpZoom * ampfactor);
			} else {
				this.setPixelsPerSample(initialZoom * factor);
			}

			if (this.isEditing) {
				let positionOfClickInWindow = startx / t.windowWidth()
				let samplesInWindow = t.windowWidth() / this.getPixelsPerSample();
				t.setWindowOriginSample(t.centerSample - (samplesInWindow * positionOfClickInWindow));				
			}
			eventQueueDispatcher.enqueueTopLevelRender();			
		}
		this.setupMouseDragHandler(renderNode, startfunction, movefunction);
	}

	setupMouseDragHandler(renderNode, startf, movef) {
		let body = null;
		let t = this;
		let mousemove = function(e) {
			movef(e);
			// wow you really have to do all this?
			e.stopPropagation();
			e.preventDefault();
		};
		let mouseup = (event) => {
			body.onmousemove = null;
			body.onmouseup = null;
			event.stopPropagation();
		};

		renderNode.getDomNode().onmousedown = (event) => {
			possiblyRecordAction(event, 'mouse');
			eventQueueDispatcher.enqueueDoClickHandlerAction(this, renderNode, true, event)
			startf(event);
			body = document.getElementsByTagName('body')[0];
			body.onmousemove = mousemove;
			body.onmouseup = mouseup;
			event.stopPropagation();
		};
	}

	minMaxSoundLevelInsidePixel(p) {
		let range = this.samplesRepresentedByPixel(p);
		if (range.start == range.end) {
			let v = this.data[range.start];
			return { min: v, max: v };
		} else if (range.end - range.start < 4) {
			return this.getMinMaxInDataRange(range.start, range.end);
		} else {
			let diff = range.end - range.start;
			// pick three random points, not at exact intervals to reduce chance of aliasing
			let midSample1 = Math.floor(range.start + .3 * diff);
			let midSample2 = Math.floor(range.start + .7 * diff);
			let d0 = this.data[range.start];
			let d1 = this.data[midSample1];
			let d2 = this.data[midSample2];
			let min = Math.min(d0, Math.min(d1, d2));
			let max = Math.max(d0, Math.max(d1, d2));
			return { min: min, max: max };
		}
	}

	renderInto(renderNode, renderFlags, withEditor) {
		let domNode = renderNode.getDomNode();
		super.renderInto(renderNode, renderFlags, withEditor);
		domNode.classList.add('wavetable');
		domNode.classList.add('data');

		let topcontrols = document.createElement('div');
		topcontrols.classList.add('wavecontrols')
		domNode.appendChild(topcontrols);
		topcontrols.appendChild(this.createTimelabel())
		if (this.recording) {
			topcontrols.appendChild(this.createStopRecordingLabel())
		} else {
			topcontrols.appendChild(this.createStartRecordingLabel())
		}
		topcontrols.appendChild(this.createSpacer())
		if (this.isEditing) {
			topcontrols.appendChild(this.createMarkerNums())
			topcontrols.appendChild(this.createAddMarker())
		}

		let canvas = this.createWaveformCanvas();
		domNode.appendChild(canvas);

		if (this.isEditing) {
			domNode.classList.add('editing');
		} else {
			domNode.classList.remove('editing');
		}
	}

	createSpacer() {
		let spacer = document.createElement('div');
		spacer.classList.add('wavecontrolspacer');
		spacer.innerText = ' ';
		return spacer;
	}

	createTimelabel() {
		let timelabel = document.createElement('div');
		timelabel.classList.add('wavecontrol');
		let n = convertSamplesToTimebase(this.getCurrentTimebase(), this.data.length);
		n = Math.round(n * 1000) / 1000;
		let suffix = getTimebaseSuffix(this.getCurrentTimebase());
		timelabel.innerText = '' + n + ' ' + suffix;
		timelabel.onmousedown = (event) => {
			this.advanceToNextTimebase();
			this.setDirtyForRendering(true);
			eventQueueDispatcher.enqueueTopLevelRender();			
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		return timelabel;
	}

	createStartRecordingLabel() {
		let recordButtonLabel = document.createElement('div');
		recordButtonLabel.classList.add('wavecontrol');
		recordButtonLabel.innerText = '* rec';
		recordButtonLabel.onmousedown = (event) => {
			startRecordingAudio(this);
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		return recordButtonLabel;
	}

	createStopRecordingLabel() {
		let recordButtonLabel = document.createElement('div');
		recordButtonLabel.classList.add('wavecontrol');
		recordButtonLabel.innerText = '[] stop';
		recordButtonLabel.onmousedown = (event) => {
			stopRecordingAudio(this);
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		return recordButtonLabel;
	}

	// createRecordinglabel() {
	// 	let recordinglabel = document.createElement('div');
	// 	recordinglabel.classList.add('wavecontrol');
	// 	recordinglabel.innerText = 'RECORDING'
	// 	return recordinglabel;		
	// }


	createAddMarker() {
		let addMarkerButton = document.createElement('div');
		addMarkerButton.classList.add('wavecontrol');
		addMarkerButton.innerText = 'v';
		addMarkerButton.onmousedown = (event) => {
			this.addMarker();
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		return addMarkerButton;
	}

	getMarkerName(n) {
		let startnum = "a".charCodeAt(0);
		let thenum = startnum + n;
		let thechar = String.fromCharCode(thenum);
		return thechar;		
	}

	createMarkerNum(n) {
		let markerNum = document.createElement('div');
		markerNum.classList.add('wavecontrol');
		markerNum.innerText = this.getMarkerName(n);
		markerNum.onmousedown = (event) => {
			this.deleteMarker(n);
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		return markerNum;
	}

	createMarkerNums() {
		let markerList = document.createElement('div');
		markerList.classList.add('markerlist');
		if (this.markers.length > 0) {
			for (let i = 0 ; i < this.markers.length; i++) {
				markerList.appendChild(this.createMarkerNum(i));
			}
		}
		return markerList;
	}

	samplesRepresentedByMultiplePixels(p, endp) {
		let z = [];
		for (let i = p; i < endp; i++) {
			z.push(this.samplesRepresentedByPixel(i));
		}
		let r = z[0];
		for (let i = 1; i < z.length; i++) {
			if (z[i].start < r.start) r.start = z[i].start;
			if (z[i].end > r.end) r.end = z[i].end;
		}
		return r;
	}

	samplesRepresentedByPixel(p) {
		let samplesPerPixel = 1 / this.getPixelsPerSample();
		let startSample = Math.floor(this.windowOriginSample + p * samplesPerPixel);
		let endSample = Math.min(this.data.length - 1, Math.floor(this.windowOriginSample + (p + 1) * samplesPerPixel));
		return {
			start: startSample,
			end: endSample
		}
	}

	// xval is a pixel position in the window
	changeCenterSample(xval) {
		let samps = this.samplesRepresentedByPixel(xval);
		if (samps.start == samps.end) {
			this.centerSample = samps.start;
		} else {
			this.centerSample = Math.floor(samps.start + (samps.end - samps.start))
		}
	}

	createWaveformCanvas() {

		let canvas = document.createElement('canvas');
		canvas.setAttribute('height', this.windowHeight());
		canvas.setAttribute('width', this.windowWidth());
		let ctx = canvas.getContext("2d");

		let pps = this.getPixelsPerSample();
		let increment = Math.ceil(pps);
		let doRect = (pps >= 2);
		let solidRect = (pps >= 1 && pps < 2);
		ctx.lineWidth = 1;
		let drawTopClippingLine = false;
		let drawBottomClippingLine = false;
		let darkTheme = (CSS_THEME == 'dark');

		let regularColor = '#444444';
		let intenseColor = '#444444';
		let auditionColor = '#aaaaaa';
		let solidRectColor = '#666666'

		if (this.isEditing) {
			regularColor = intenseColor = '#888888';
			solidRectColor = '#999999';
		}

		let markerColor = '#ad6411';
		let lightMarkerColor = '#dbae7b';
		let clippingColor = '#cf728c';

		let currentSampleColor = '#0ec43f';

		let zeroColor = '#000000';

		if (darkTheme) {
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, this.windowWidth(), this.windowHeight());
			regularColor = '#bbbbbb';
			intenseColor = '#ffffff';
		}
		for (let i = 0 ; i < this.windowWidth(); i += increment) {
			let range = this.samplesRepresentedByMultiplePixels(i, i + increment);
			let v = this.minMaxSoundLevelInsidePixel(i);
			if (v.max > 1) drawTopClippingLine = true;
			if (v.min < -1) drawBottomClippingLine = true;
			let top = this.yPositionOfWaveValue(v.max);
			let bottom = this.yPositionOfWaveValue(v.min);
			let doAudition = (this.sectionBeingAuditioned &&
				range.start >= this.sectionBeingAuditioned.start &&
				range.start < this.sectionBeingAuditioned.end);
			if (doRect || solidRect) {
				let center = this.yPositionOfWaveValue(0);
				let start = top;
				let end = center;
				if (top > center) {
					start = center;
					end = bottom;
				}
				let height = end - start;
				let width = increment;

				if (doAudition) {
					ctx.beginPath();
					ctx.fillStyle = auditionColor;
					ctx.fillRect(i, 0, width, this.windowHeight());
				}
				if (doRect) {
					ctx.beginPath();
					ctx.strokeStyle = regularColor;
					ctx.strokeRect(i, start, width, height);
				} else {
					ctx.beginPath();
					ctx.fillStyle = solidRectColor;
					ctx.fillRect(i, start, width, height);
				}
			} else {
				if (doAudition) {
					this.drawVertLine(ctx, i, false, auditionColor);					
				}
				let center = this.yPositionOfWaveValue(0);
				let start = top;
				let end = bottom;
				if (top < center && bottom < center) {
					ctx.beginPath();
					ctx.strokeStyle = intenseColor;
					ctx.moveTo(i, top);
					ctx.lineTo(i, bottom);					
					ctx.stroke();

					ctx.beginPath();
					ctx.strokeStyle = regularColor;
					ctx.moveTo(i, bottom);					
					ctx.lineTo(i, center);					
					ctx.stroke();

				} else if (top > center && bottom > center) {
					ctx.beginPath();
					ctx.strokeStyle = regularColor;
					ctx.moveTo(i, center);
					ctx.lineTo(i, top);					
					ctx.stroke();

					ctx.beginPath();
					ctx.strokeStyle = intenseColor;
					ctx.moveTo(i, top);					
					ctx.lineTo(i, bottom);					
					ctx.stroke();
				} else {
					ctx.beginPath();
					ctx.moveTo(i, top);
					ctx.strokeStyle = regularColor;
					ctx.lineTo(i, bottom);					
					ctx.stroke();					
				}
			}
			// do lines here if necessary
			if (this.isEditing) {
				for (let j = 0; j < this.markers.length; j++) {
					let marker = this.markers[j];
					if (this.shouldDoLine(marker, range)) {
						this.drawVertLine(ctx, i, false, markerColor);
					}
				}
				if (this.shouldDoLine(this.centerSample, range)) {
					this.drawVertLine(ctx, i, false, currentSampleColor);
				}
			} else {
				for (let j = 0; j < this.markers.length; j++) {
					let marker = this.markers[j];
					if (this.shouldDoLine(marker, range)) {
						this.drawVertLine(ctx, i, false, lightMarkerColor);
					}
				}
			}

		}
		// draw marker names
		for (let i = 0; i < this.markers.length; i++) {
			let n = this.getMarkerName(i);
			let xpos = this.xPositionOfSampleNumber(this.markers[i]);
			let boxy = 0;
			let namey = boxy + 10;
			let nameind = 3;
			let boxsize = 13;
			ctx.beginPath();
			ctx.fillStyle = '#ffffff';
			ctx.strokeStyle = '#000000';
			ctx.font = "11px Courier";
			ctx.fillRect(xpos, boxy, boxsize, boxsize);
			ctx.strokeRect(xpos, boxy, boxsize, boxsize);
			ctx.fillStyle = '#000000';
			ctx.fillText(n, xpos + nameind, namey);
		}
		if (drawTopClippingLine) {
			this.drawHorizLine(ctx, 1, true, clippingColor);
		}
		if (drawBottomClippingLine) {
			this.drawHorizLine(ctx, -1, true, clippingColor);
		}
		if (this.rightIsClipping) {
			this.drawEndCap(ctx);
			// this.drawVertLine(ctx, this.windowWidth() - 10, false, zeroColor)
			// this.drawVertLine(ctx, this.windowWidth() - 20, false, zeroColor)
			// this.drawVertLine(ctx, this.windowWidth() - 30, false, zeroColor)
		}

		return canvas;
	}

	shouldDoLine(lineSample, range) {
		return (range.start == range.end && lineSample == range.start)
				||
				(lineSample >= range.start && lineSample < range.end);
	}

	debugString() {
		return "<not impl>"
	}

	drawEndCap(ctx) {
		let color1 = '#ffffff';
		let color2 = '#dddddd';
		let color3 = '#bbbbbb';
		let color4 = '#999999';
		let stripwidth = 10;
		ctx.beginPath();
		ctx.fillStyle = color1;
		ctx.fillRect(this.windowWidth() - 4 * stripwidth, 0, stripwidth, this.windowHeight());
		ctx.beginPath();
		ctx.fillStyle = color2;
		ctx.fillRect(this.windowWidth() - 3 * stripwidth, 0, stripwidth, this.windowHeight());
		ctx.beginPath();
		ctx.fillStyle = color3;
		ctx.fillRect(this.windowWidth() - 2 * stripwidth, 0, stripwidth, this.windowHeight());
		ctx.beginPath();
		ctx.fillStyle = color4;
		ctx.fillRect(this.windowWidth() - 1 * stripwidth, 0, stripwidth, this.windowHeight());
	}


	drawVertLine(ctx, x, dash, color) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.strokeStyle = color;
		if (dash) {
			ctx.setLineDash([10, 5])
		}
		ctx.lineTo(x, this.windowHeight());
		ctx.stroke();
		ctx.setLineDash([]);		
	}


	drawHorizLine(ctx, atY, dash, color) {
		let lineY = this.yPositionOfWaveValue(atY);
		ctx.beginPath();
		ctx.moveTo(0, lineY);
		ctx.strokeStyle = color;
		if (dash) {
			ctx.setLineDash([10, 5])
		}
		ctx.lineTo(this.windowWidth(), lineY);
		ctx.stroke();
		ctx.setLineDash([]);		
	}

	getEventTable(context) {
		return {
			'Enter': 'audition-wave',
		}
	}

	cleanupOnMemoryFree() {
		if (this.recording) {
			stopRecordingAudio(this);
		}
	}

}


class WavetableEditor extends Editor {

	constructor(nex) {
		super(nex, 'WavetableEditor');
	}

	getStateForUndo() {
		return this.nex.getData();
	}

	setStateForUndo(val) {
		this.nex.setData(val);
	}


	shouldIgnore(text) {
		if (/^[0-9v]$/.test(text)) return false;
		return text != 'Enter'
	}

	doAppendEdit(text) {
		if (text == 'v') {
			this.nex.addMarker();
		} else {
			this.nex.auditionSection(text);
		}
	}

	shouldAppend(text) {
		if (/^[0-9v]$/.test(text)) return true;
		return false;
	}


	memUsed() {
		return super.memUsed() + heap.sizeWavetable();
	}
}

function constructWavetableWithFileData(data) {

}

function constructWavetable(initSize) {
	if (!initSize) {
		initSize = 256;
	}
	let sizeRequired = heap.sizeWavetable() + initSize * heap.incrementalSizeWavetable();
	if (!heap.requestMem(sizeRequired)) {
		throw constructFatalError(`OUT OF MEMORY: cannot allocate Wavetable.
stats: ${heap.stats()}`)
	}
	return heap.register(new Wavetable(initSize));
}


export { Wavetable, WavetableEditor, constructWavetable }
