var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventjs = function (exports) {
	'use strict';

	// js-utils
	// event.js
	// https://github.com/jniac/js-utils

	function isIterable(obj) {

		return obj && Symbol && typeof obj[Symbol.iterator] === 'function';
	}

	function iterate(target, callback) {

		if (isIterable(target)) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = target[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var object = _step.value;

					callback(object);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		} else {

			callback(target);
		}
	}

	var Event = function () {
		function Event(type, options) {
			_classCallCheck(this, Event);

			Object.defineProperties(this, {

				type: { value: type },
				options: { value: options }

			});
		}

		_createClass(Event, [{
			key: 'clone',
			value: function clone() {

				var event = new Event(this.type, this.options);

				return Object.assign(event, this);
			}
		}, {
			key: 'initTarget',
			value: function initTarget(target) {
				var currentTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


				Object.defineProperties(this, {

					target: {

						value: target

					},

					currentTarget: {

						writable: true,
						value: currentTarget || target

					}

				});

				return this;
			}
		}, {
			key: 'cancel',
			value: function cancel() {

				this.canceled = true;
			}
		}]);

		return Event;
	}();

	var EventListener = function () {
		function EventListener(eventDispatcher, type, callback, priority, maxCount, thisArg) {
			_classCallCheck(this, EventListener);

			this.eventDispatcher = eventDispatcher;
			this.type = type;
			this.callback = callback;
			this.priority = priority;
			this.maxCount = maxCount;
			this.thisArg = thisArg;
			this.count = 0;
		}

		_createClass(EventListener, [{
			key: 'test',
			value: function test(type) {

				if (this.disabled) return false;

				if (type === 'all') return true;

				if (this.type instanceof RegExp) return this.type.test(type);

				return this.type === type;
			}
		}, {
			key: 'call',
			value: function call(event) {

				this.callback.call(this.thisArg, event);

				if (++this.count >= this.maxCount) this.kill();
			}
		}, {
			key: 'kill',
			value: function kill() {

				for (var k in this) {
					delete this[k];
				}
			}
		}, {
			key: 'isKilled',
			value: function isKilled() {

				return !this.eventDispatcher && !this.type && !this.callback;
			}
		}]);

		return EventListener;
	}();

	var listenersKey = typeof Symbol === 'undefined' ? '__listeners' : Symbol('eventListeners');

	var Prototype = {
		getEventListeners: function getEventListeners() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref$createIfNull = _ref.createIfNull,
			    createIfNull = _ref$createIfNull === undefined ? false : _ref$createIfNull,
			    _ref$copy = _ref.copy,
			    copy = _ref$copy === undefined ? false : _ref$copy;

			if (!this[listenersKey]) {

				if (!createIfNull) return [];

				Object.defineProperty(this, listenersKey, {

					configurable: true,
					value: []

				});
			}

			return copy ? this[listenersKey].concat() : this[listenersKey];
		},
		getListenerIndexFor: function getListenerIndexFor(priority, before) {

			var listeners = Prototype.getEventListeners.call(this);

			for (var listener, i = 0; listener = listeners[i]; i++) {
				if (before && priority >= listener.priority || !before && priority > listener.priority) return i;
			}return listeners.length;
		},
		dispatchEvent: function dispatchEvent(eventOrType) {
			var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


			if (typeof eventOrType === 'string') {

				var events = eventOrType.split(/(?:\s+)|(?:,\s*)/);

				if (events.length > 1) {
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {

						for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var v = _step2.value;

							Prototype.dispatchEvent.call(this, v, eventParams);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					return this;
				}
			}

			var event = typeof eventOrType === 'string' ? new Event(eventOrType, options).initTarget(this) : eventOrType;

			Object.assign(event, eventParams);

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Prototype.getEventListeners.call(this, { copy: true, createIfNull: false })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _listener = _step3.value;


					if (_listener.test(event.type)) _listener.call(event);

					if (event.canceled) break;
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			for (var listener, listeners = Prototype.getEventListeners.call(this, { createIfNull: false }), i = 0; listener = listeners[i]; i++) {
				if (listener.isKilled()) listeners.splice(i--, 1);
			}if (!event.canceled && event.options && event.options.propagateTo) {

				var targets = event.options.propagateTo(event.currentTarget) || [];

				if (!isIterable(targets)) targets = [targets];

				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var target = _step4.value;


						var event2 = event.clone().initTarget(event.target, target);

						Prototype.dispatchEvent.call(target, event2, eventParams);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}
			}

			return this;
		},
		addEventListener: function addEventListener(type, callback) {
			var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
			    _ref2$priority = _ref2.priority,
			    priority = _ref2$priority === undefined ? 0 : _ref2$priority,
			    _ref2$insertBefore = _ref2.insertBefore,
			    insertBefore = _ref2$insertBefore === undefined ? false : _ref2$insertBefore,
			    _ref2$thisArg = _ref2.thisArg,
			    thisArg = _ref2$thisArg === undefined ? null : _ref2$thisArg,
			    _ref2$max = _ref2.max,
			    max = _ref2$max === undefined ? Infinity : _ref2$max;

			if (typeof type === 'string') {

				var types = type.split(/(?:\s+)|(?:,\s*)/);

				if (types.length > 1) {
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {

						for (var _iterator5 = types[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var v = _step5.value;

							Prototype.addEventListener.call(this, v, callback, { priority: priority, insertBefore: insertBefore, thisArg: thisArg, max: max });
						}
					} catch (err) {
						_didIteratorError5 = true;
						_iteratorError5 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion5 && _iterator5.return) {
								_iterator5.return();
							}
						} finally {
							if (_didIteratorError5) {
								throw _iteratorError5;
							}
						}
					}

					return this;
				}
			}

			var listeners = Prototype.getEventListeners.call(this, { createIfNull: true });

			var index = Prototype.getListenerIndexFor.call(this, priority, insertBefore);

			listeners.splice(index, 0, new EventListener(this, type, callback, priority, max, thisArg));

			return this;
		},
		clearEventListeners: function clearEventListeners() {

			var listeners = Prototype.getEventListeners.call(this);

			while (listeners.length) {
				listeners.pop().kill();
			}delete this[listenersKey];

			return this;
		},
		removeEventListener: function removeEventListener(type) {
			var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


			var listeners = Prototype.getEventListeners.call(this);

			for (var listener, i = 0; listener = listeners[i]; i++) {

				if (String(listener.type) === String(type) && (!callback || callback === listener.callback)) {

					listeners.splice(i--, 1);
					listener.kill();
				}
			}

			return this;
		}
	};

	var Shorthands = {

		on: Prototype.addEventListener,

		once: function once(type, callback) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


			Prototype.addEventListener.call(this, type, callback, Object.assign(option, { max: 1 }));

			return this;
		},


		off: Prototype.removeEventListener

	};

	function implementEventDispatcher(target) {
		var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref3$applyShortands = _ref3.applyShortands,
		    applyShortands = _ref3$applyShortands === undefined ? true : _ref3$applyShortands,
		    _ref3$remap = _ref3.remap,
		    remap = _ref3$remap === undefined ? null : _ref3$remap;

		var remapK = typeof remap === 'function' ? remap : function (k) {
			return remap ? remap[k] || k : k;
		};

		for (var k in Prototype) {
			Object.defineProperty(target, remapK(k), { value: Prototype[k] });
		}if (applyShortands) for (var _k in Shorthands) {
			Object.defineProperty(target, remapK(_k), { value: Shorthands[_k] });
		}return target;
	}

	var EventDispatcher = function EventDispatcher() {
		_classCallCheck(this, EventDispatcher);
	};

	implementEventDispatcher(EventDispatcher.prototype);

	function on(target, type, callback, options) {

		iterate(target, function (object) {
			return Shorthands.on.call(object, type, callback, options);
		});

		return target;
	}

	function once(target, type, callback, options) {

		iterate(target, function (object) {
			return Shorthands.once.call(object, type, callback, options);
		});

		return target;
	}

	function off(target, type, callback, options) {

		iterate(target, function (object) {
			return Shorthands.off.call(object, type, callback, options);
		});

		return target;
	}

	function dispatchEvent(target, type, eventParams, options) {

		iterate(target, function (object) {
			return Prototype.dispatchEvent.call(object, type, eventParams, options);
		});

		return target;
	}

	function getEventListeners(target, options) {

		return Prototype.getEventListeners.call(target, options);
	}

	function clearEventListeners(target) {

		iterate(target, function (object) {
			return Prototype.clearEventListeners.call(object);
		});

		return target;
	}

	exports.Event = Event;
	exports.listenersKey = listenersKey;
	exports.implementEventDispatcher = implementEventDispatcher;
	exports.EventDispatcher = EventDispatcher;
	exports.on = on;
	exports.once = once;
	exports.off = off;
	exports.dispatchEvent = dispatchEvent;
	exports.getEventListeners = getEventListeners;
	exports.clearEventListeners = clearEventListeners;

	return exports;
}({});
