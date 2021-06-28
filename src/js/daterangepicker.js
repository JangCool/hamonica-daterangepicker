import defaulOptions from './options/default.options';
import localeOptions from './options/default.locale';

/**
 * 
 * @param {*} element 엘리먼트
 * @param {*} options 옵션
 * @param {*} cb 콜백
 */
class DateRangePicker{

    #options;
    #locale;

    constructor(element, options, cb){

        this.#initOptions(options);
    }

    #initOptions(options) {

        this.#options = _.cloneDeep(defaulOptions,{

        }, options || {});

        this.#locale = _.cloneDeep(localeOptions,{

        }, options.locale || {});
    }
};

DateRangePicker.prototype = {

};

const datePicker = (element, options, cb) => {
    return new DateRangePicker(element, options, cb);
}

const dateRangePicker = (element, options, cb) => {
    return new DateRangePicker(element, options, cb);
}

export {
    datePicker,
    dateRangePicker
} 