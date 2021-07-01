import DatePicker from './DatePicker';

class DateRangePicker {

    #datePicker;

    #ranges = {};

    /**
     * 
     * @param {Element} element 대상 엘리먼트
     * @param {Object} options DateRangePicker 설정 값.
     * @param {Fuction} cb 콜백 함수 
     */
    constructor(element, options, cb) {
       
        this.#datePicker = new DatePicker(element, options, cb);
        this.#initRange();
    }

    #initRange = () => {

        let options = this.#datePicker.getOptions();
        let locale = this.#datePicker.getLocale();

        let moment = this.#datePicker.getMoment();

        let start = options.startDate;
        let end = options.endDate;

        //좌측에 보여주는 범위 항목들 출력.
        for (const range in options.ranges) {

            if (typeof options.ranges[range][0] === 'string')
                start = moment(options.ranges[range][0], locale.format);
            else
                start = moment(options.ranges[range][0]);

            if (typeof options.ranges[range][1] === 'string')
                end = moment(options.ranges[range][1], locale.format);
            else
                end = moment(options.ranges[range][1]);

            // If the start or end date exceed those allowed by the minDate or maxSpan
            // options, shorten the range to the allowable period.
            if (options.minDate && start.isBefore(options.minDate))
                start = options.minDate.clone();

            var maxDate = options.maxDate;
            if (options.maxSpan && maxDate && start.clone().add(options.maxSpan).isAfter(maxDate))
                maxDate = start.clone().add(options.maxSpan);
            if (maxDate && end.isAfter(maxDate))
                end = maxDate.clone();

            // If the end of the range is before the minimum or the start of the range is
            // after the maximum, don't display this range option at all.
            if ((options.minDate && end.isBefore(options.minDate, options.timepicker ? 'minute' : 'day'))
                || (maxDate && start.isAfter(maxDate, options.timepicker ? 'minute' : 'day')))
                continue;

            //Support unicode chars in the range names.
            var elem = document.createElement('textarea');
            elem.innerHTML = range;
            var rangeHtml = elem.value;

            this.#ranges[rangeHtml] = [start, end];
        }

        var list = '<ul>';
        for (const range in this.#ranges) {
            list += '<li data-range-key="' + range + '">' + range + '</li>';
        }
        if (options.showCustomRangeLabel) {
            list += '<li data-range-key="' + locale.customRangeLabel + '">' + locale.customRangeLabel + '</li>';
        }
        list += '</ul>';

                    
        // render performance...
        var fragment = document.createDocumentFragment();
        fragment.appendChild(this.#datePicker.createFragment(list));

        this.#datePicker.getContainer().querySelector('.ranges').prepend(fragment);
    }

    remove = () => {
        this.#datePicker.remove();
    }
};

export default DateRangePicker;