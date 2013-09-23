/*!
 * Carousell v0.1.0
 *
 * A simple javascript plugin for creating typewriter effects.
 *
 * Copyright (c) 2013, MEDIASTUTTGART, http://mediastuttgart.de
 *
 * This file is released under the terms of the MIT license.
 * You can find the complete text in the attached LICENSE
 * file or online at:
 *
 * http://www.opensource.org/licenses/mit-license.php
 */

/* jshint strict: true */
/* global define: true, eventie: true, Hammer: true */

(function (window) {

'use strict';

var $ = window.jQuery;

// -------------------------- helpers -------------------------- //

function extend (a, b) {
	for (var prop in b) {
		if (typeof b[prop] === 'object') {
			a[prop] = extend(a[prop], b[prop]);
		}
		else {
			a[prop] = b[prop];
		}
	}

	return a;
}

var objToString = Object.prototype.toString;

function isArray (obj) {
	return objToString.call(obj) === '[object Array]';
}

function makeArray (obj) {
	var ary = [];

	if (isArray(obj)) {
		ary = obj;
	}
	else if (typeof obj.length === 'number') {
		for (var i=0, len = obj.length; i < len; i++) {
			ary.push(obj[i]);
		}
	}
	else {
		ary.push(obj);
	}

	return ary;
}

// -------------------------- core -------------------------- //

function defineCarousell (EventEmitter) {
	/* Carousell */
	function Carousell (element, options, callback) {
		var _this = this;

		if (!(_this instanceof Carousell)) {
			return new Carousell(element, options, callback);
		}

		if (typeof element === 'string') {
			element = document.querySelectorAll(element);
		}

		_this.elements = makeArray(element);

		_this.options = extend({
			animationSpeed: 0.5,
			showBullets: false,
			loopRewind: false
		}, _this.options);

		_this.options.hammer = extend({
			drag_lock_to_axis: true
		}, _this.options.hammer);

		if (typeof options === 'function') {
			callback = options;
		}
		else {
			extend(_this.options, options);
		}

		if (callback) {
			_this.on('ready', callback);
		}

		for (var i = 0, elementLength = _this.elements.length; i < elementLength; i++) {
			var element = this.elements[i].getElementsByTagName('ul')[0] || this.elements[i].getElementsByTagName('ol')[0];

			if (element === undefined) {
				return false;
			}

			this.elements[i] = _this.initCarousell(element);
		}

		return _this;
	}

	/* Event emitter */
	Carousell.prototype = new EventEmitter();

	// -------------------------- methods -------------------------- //

	/* Init carousel */
	Carousell.prototype.initCarousell = function (element) {
		var _this = this;

		element.panes = [];

		var children    = element.children;
		var childLength = children.length;

		for (var j = 0; j < childLength; j++) {
			if (children[j].tagName === 'LI') {
				element.panes[j] = children[j];
			}
		}

		if (element.panes.length === 0) {
			return false;
		}

		element.paneWidth   = 0;
		element.paneCount   = element.panes.length;
		element.currentPane = 0;
		element.offset      = 0;
		element.classNames  = element.className;

		_this.setDimensions(element);
		_this.bindEvents(element);
		_this.showPane(element.currentPane, element, false, true, true);

		_this.onReady(element);

		return element;
	};

	/* Set dimensions */
	Carousell.prototype.setDimensions = function (element) {
		element.paneWidth = element.parentNode.offsetWidth;

		for (var i = 0; i < element.paneCount; i++) {
			element.panes[i].style.width = element.paneWidth + 'px';
		}

		element.style.width = (element.paneWidth * element.paneCount) + 'px';
	};

	/* Bind events */
	Carousell.prototype.bindEvents = function (element) {
		var _this = this;

		eventie.bind(window, 'resize', function () {
			_this.setDimensions(element);
			_this.showPane(element.currentPane, element, false, false, false);
		});

		_this.on('prev', function () {
			_this.prev(element);
		});

		_this.on('next', function () {
			_this.next(element);
		});

		_this.on('showPane', function (index) {
			if (index !== _this.currentPane) {
				_this.showPane(index, element, true, true, true);
			}
		});

		element.hammer = new Hammer(element, _this.options.hammer);

		element.hammer.on('release dragleft dragright swipeleft swiperight', function (event) {
			_this.handleGestures(event, element);
		});

		element.hammer.on('dragstart', function () {
			element.className = 'dragging ' + element.classNames;
		});

		element.hammer.on('release swipeleft swiperight', function () {
			element.className = element.classNames;
		});
	};

	/* Show pane */
	Carousell.prototype.showPane = function (index, element, animate, events, paneChange) {
		var _this       = this;
		var currentPane = Math.max(0, Math.min(index, element.paneCount - 1));
		var offset      = -((100 / element.paneCount) * currentPane);

		element.currentPane = currentPane;

		_this.setOffset(offset, element, animate, events, paneChange);
	};

	/* Set offset*/
	Carousell.prototype.setOffset = function (percent, element, animate, events, paneChange) {
		var _this    = this;
		var offset   = ((element.paneWidth * element.paneCount) / 100) * percent;
		var duration = animate ? _this.options.animationSpeed : 0;

		TweenMax.to(element, duration, {
			left: offset,
			ease: Expo.easeOut,
			onComplete: function () {
				if (events) {
					_this.onAnimationComplete(element, paneChange);
				}
			}
		});
	};

	/* Handle gestures */
	Carousell.prototype.handleGestures = function (event, element) {
		var _this = this;

		event.gesture.preventDefault();
		event.gesture.stopPropagation();

		switch(event.type) {
			case 'dragright':
			case 'dragleft':
				var paneOffset = -(100 / element.paneCount) * element.currentPane;
				var dragOffset = ((100 / element.paneWidth) * event.gesture.deltaX) / element.paneCount;

				if (
					(element.currentPane === 0 && event.gesture.direction === Hammer.DIRECTION_RIGHT) ||
					(element.currentPane === element.paneCount - 1 && event.gesture.direction === Hammer.DIRECTION_LEFT)
				) {
					dragOffset *= 0.4;
				}

				_this.setOffset(dragOffset + paneOffset, element, false, false);
			break;

			case 'swipeleft':
				_this.next(element);

				event.gesture.stopDetect();
			break;

			case 'swiperight':
				_this.prev(element);

				event.gesture.stopDetect();
			break;

			case 'release':
				if (Math.abs(event.gesture.deltaX) > element.paneWidth / 2) {
					if (event.gesture.direction === 'right') {
						_this.prev(element);
					}
					else {
						_this.next(element);
					}
				}
				else {
					_this.showPane(element.currentPane, element, true, false, false);
				}
			break;
		}
	};

	/* Prev pane */
	Carousell.prototype.prev = function (element) {
		var _this = this;

		if (element.currentPane !== 0) {
			_this.showPane(element.currentPane - 1, element, true, true, true);
		}
		else if (_this.options.loopRewind) {
			_this.showPane(element.paneCount - 1, element, true, true, true);
		}
		else {
			_this.showPane(element.currentPane, element, true, true, false);
		}
	};

	/* Next pane */
	Carousell.prototype.next = function (element) {
		var _this = this;

		if ((element.currentPane + 1) !== element.paneCount) {
			_this.showPane(element.currentPane + 1, element, true, true, true);
		}
		else if (_this.options.loopRewind) {
			_this.showPane(element.currentPane - (element.paneCount - 1), element, true, true, true);
		}
		else {
			_this.showPane(element.currentPane, element, true, true, false);
		}
	};

	// -------------------------- events -------------------------- //

	/* Ready */
	Carousell.prototype.onReady = function (element) {
		var _this = this;

		setTimeout(function () {
			_this.emit('ready', _this, element);
		});
	};

	/* Animation complete*/
	Carousell.prototype.onAnimationComplete = function (element, paneChange) {
		var _this = this;

		element.className = element.classNames;

		setTimeout(function () {
			_this.emit('animationComplete', _this, element, paneChange);
		});
	};

	// -------------------------- jquery -------------------------- //

	if ($) {
		$.fn.Carousell = function (options, callback) {
			return new Carousell(this, options, callback);
		};
	}

	return Carousell;
}

// -------------------------- transport -------------------------- //

if (typeof define === 'function' && define.amd) {
	define(['eventEmitter/EventEmitter'], defineCarousell);
}
else {
	window.Carousell = defineCarousell(window.EventEmitter);
}

})(window);
