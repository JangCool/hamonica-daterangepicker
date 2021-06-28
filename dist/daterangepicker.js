(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hamonica"] = factory();
	else
		root["hamonica"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "datePicker": () => (/* binding */ datePicker),
  "dateRangePicker": () => (/* binding */ dateRangePicker)
});

;// CONCATENATED MODULE: ./src/js/options/default.options.js
/**
 * DateRangePicker 기본 설정.
 */
/* harmony default export */ const default_options = ({
  //default settings for options
  parentEl: 'body',
  element: null,
  startDate: null,
  endDate: null,
  minDate: false,
  maxDate: false,
  maxSpan: false,
  autoApply: false,
  singleDatePicker: false,
  showDropdowns: false,
  minYear: null,
  maxYear: null,
  showWeekNumbers: false,
  showISOWeekNumbers: false,
  showCustomRangeLabel: true,
  timePicker: false,
  timePicker24Hour: false,
  timePickerIncrement: 1,
  timePickerSeconds: false,
  linkedCalendars: true,
  autoUpdateInput: true,
  alwaysShowCalendars: false,
  ranges: {},
  buttonClasses: 'btn btn-sm',
  applyButtonClasses: 'btn-primary',
  cancelButtonClasses: 'btn-default',
  opens: null,
  drops: null
});
;// CONCATENATED MODULE: ./src/js/options/default.locale.js
/* harmony default export */ const default_locale = ({
  direction: 'ltr',
  format: null,
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: null,
  monthNames: null,
  firstDay: null
});
;// CONCATENATED MODULE: ./src/js/daterangepicker.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }



/**
 * 
 * @param {*} element 엘리먼트
 * @param {*} options 옵션
 * @param {*} cb 콜백
 */

var _options = /*#__PURE__*/new WeakMap();

var _locale = /*#__PURE__*/new WeakMap();

var _initOptions = /*#__PURE__*/new WeakSet();

var DateRangePicker = function DateRangePicker(element, _options2, cb) {
  _classCallCheck(this, DateRangePicker);

  _initOptions.add(this);

  _options.set(this, {
    writable: true,
    value: void 0
  });

  _locale.set(this, {
    writable: true,
    value: void 0
  });

  _classPrivateMethodGet(this, _initOptions, _initOptions2).call(this, _options2);
};

function _initOptions2(options) {
  _classPrivateFieldSet(this, _options, _.cloneDeep(default_options, {}, options || {}));

  _classPrivateFieldSet(this, _locale, _.cloneDeep(default_locale, {}, options.locale || {}));
}

;
DateRangePicker.prototype = {};

var datePicker = function datePicker(element, options, cb) {
  return new DateRangePicker(element, options, cb);
};

var dateRangePicker = function dateRangePicker(element, options, cb) {
  return new DateRangePicker(element, options, cb);
};


/******/ 	return __webpack_exports__;
/******/ })()
;
});