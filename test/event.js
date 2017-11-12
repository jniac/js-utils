var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventjs = function (exports) {
	'use strict';

	var Event = function () {
		function Event(type) {
			_classCallCheck(this, Event);

			this.type = type;
		}

		_createClass(Event, [{
			key: 'cancel',
			value: function cancel() {

				this.canceled = true;
			}
		}]);

		return Event;
	}();

	var Listener = function () {
		function Listener(eventDispatcher, type, callback, priority, maxCount, thisArg) {
			_classCallCheck(this, Listener);

			this.eventDispatcher = eventDispatcher;
			this.type = type;
			this.callback = callback;
			this.priority = priority;
			this.maxCount = maxCount;
			this.thisArg = thisArg;
			this.count = 0;
		}

		_createClass(Listener, [{
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

		return Listener;
	}();

	var EventDispatcherPrototype = {
		getListeners: function getListeners() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref$copy = _ref.copy,
			    copy = _ref$copy === undefined ? false : _ref$copy;

			if (!this.__listeners) Object.defineProperty(this, '__listeners', { value: [] });

			return copy ? this.__listeners.concat() : this.__listeners;
		},
		getListenerIndexFor: function getListenerIndexFor(priority, before) {

			var listeners = this.getListeners();

			for (var listener, i = 0; listener = listeners[i]; i++) {
				if (before && priority >= listener.priority || !before && priority > listener.priority) return i;
			}return listeners.length;
		},
		dispatchEvent: function dispatchEvent(eventOrType) {
			var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


			if (typeof eventOrType === 'string') {

				var events = eventOrType.split(/(?:\s+)|(?:,\s*)/);

				if (events.length > 1) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {

						for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var v = _step.value;

							this.dispatchEvent(v, eventParams);
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

					return this;
				}
			}

			var event = typeof eventOrType === 'string' ? new Event(eventOrType) : eventOrType;

			Object.assign(event, eventParams);

			Object.defineProperty(event, 'target', { value: this });

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.getListeners({ copy: true })[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _listener = _step2.value;


					if (_listener.test(event.type)) _listener.call(event);

					if (event.canceled) break;
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

			for (var listener, listeners = this.getListeners(), i = 0; listener = listeners[i]; i++) {
				if (listener.isKilled()) listeners.splice(i--, 1);
			}return this;
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
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {

						for (var _iterator3 = types[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var v = _step3.value;

							this.addEventListener(v, callback, { priority: priority, insertBefore: insertBefore, thisArg: thisArg, max: max });
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

					return this;
				}
			}

			var listeners = this.getListeners();

			var index = this.getListenerIndexFor(priority, insertBefore);

			listeners.splice(index, 0, new Listener(this, type, callback, priority, max, thisArg));

			return this;
		},
		removeAllEventListeners: function removeAllEventListeners() {

			var listeners = this.getListeners();

			while (listeners.length) {
				listeners.pop().kill();
			}return this;
		},
		removeEventListener: function removeEventListener(type) {
			var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


			var listeners = this.getListeners();

			for (var listener, i = 0; listener = listeners[i]; i++) {

				if (listener.type === type && (!callback || callback === listener.callback)) {

					listeners.splice(i--, 1);
					listener.kill();
				}
			}

			return this;
		}
	};

	var EventDispatcherShorthands = {

		on: EventDispatcherPrototype.addEventListener,

		once: function once(type, callback) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


			this.addEventListener(type, callback, Object.assign(option, { max: 1 }));

			return this;
		},


		off: EventDispatcherPrototype.removeEventListener

	};

	function implementEventDispatcher(target) {
		var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref3$applyShortands = _ref3.applyShortands,
		    applyShortands = _ref3$applyShortands === undefined ? true : _ref3$applyShortands;

		for (var k in EventDispatcherPrototype) {
			Object.defineProperty(target, k, { value: EventDispatcherPrototype[k] });
		}if (applyShortands) for (var _k in EventDispatcherShorthands) {
			Object.defineProperty(target, _k, { value: EventDispatcherShorthands[_k] });
		}Object.defineProperty(target, 'isEventDispatcher', { value: true });
	}

	var EventDispatcher = function EventDispatcher() {
		_classCallCheck(this, EventDispatcher);
	};

	implementEventDispatcher(EventDispatcher.prototype);

	exports.Event = Event;
	exports.implementEventDispatcher = implementEventDispatcher;
	exports.EventDispatcher = EventDispatcher;

	return exports;
}({});
