import DatePicker from './DatePicker';
import { hide, show} from './functions/functions';

class DateRangePicker {

    #datePicker;

    #ranges = {};

    /**
     * 
     * @param {Element} element 대상 엘리먼트
     * @param {Object} options DateRangePicker 설정 값.
     * @param {Fuction} cb 콜백 함수 
     */
    constructor(dayjs, element, options, cb) {

        this.#datePicker = new DatePicker(dayjs, element, options, cb);
        this.#initRange();
    }

    #initRange = () => {

        let options = this.#datePicker.getOptions();
        let locale = this.#datePicker.getLocale();

        let dayjs = this.#datePicker.getDayjs();

        let start = options.startDate;
        let end = options.endDate;
        //좌측에 보여주는 범위 항목들 출력.
        for (const range in options.ranges) {

            if (typeof options.ranges[range][0] === 'string')
                start = dayjs(options.ranges[range][0], locale.format);
            else
                start = dayjs(options.ranges[range][0]);

            if (typeof options.ranges[range][1] === 'string')
                end = dayjs(options.ranges[range][1], locale.format);
            else
                end = dayjs(options.ranges[range][1]);

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

        let rangesElement = this.#datePicker.getContainer().querySelector('.ranges');

        rangesElement.prepend(fragment);
        
        if(options.showRanges){
            show(rangesElement);
        }else{
            hide(rangesElement)
        }
    }

    setTheme = (theme) => {
        this.#datePicker.setTheme(theme);
    }

    setDarkMode = (isDarkMode) => {
        this.#datePicker.setDarkMode(isDarkMode);
    }

    setStartDate = (datetime) => {
        return this.#datePicker.setStartDate(datetime);
    }

    setEndDate = (datetime) => {
        return this.#datePicker.setEndDate(datetime);
    }

    getStartDate = () => {
        return this.#datePicker.getStartDate();
    }

    getEndDate = () => {
        return this.#datePicker.getEndDate();
    }

    getElement = () => {
        return this.#datePicker.getElement();
    }

    getDayjs = () => {
        return this.#datePicker.getDayjs();
    }

    show = () => {
        return this.#datePicker.show();
    }

    hide = () => {
        return this.#datePicker.hide();
    }

    remove = () => {
        this.#datePicker.remove();
    }
};

export default DateRangePicker;