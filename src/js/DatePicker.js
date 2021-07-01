import defaulOptions from './options/default.options';
import localeOptions from './options/default.locale';
import _ from 'lodash';
import util from './util/util.date';
import moment from 'moment';
import "moment/locale/ko";
import "moment/locale/es-us";

moment.locale("ko");

class DatePicker {
    
    /**
     * 부모 엘리먼트
     */
    #moment = moment;

    /**
     * 부모 엘리먼트
     */
    #parentEl;

    /**
     * DatePicker UI 레이아웃.
     */
    #container;

    /**
     * 설정 정보
     */
    #options;

    /**
     * 지역별 포맷 객체
     */
    #locale;

    /**
     * 대상 input Element
     */
    #element;

    //some state information
    #isShowing = false;

    #leftCalendar = {};

    #rightCalendar = {};

    #previousRightTime;

    constructor(element, options, cb) {
        
        this.#element = element;

        this.#initOptions(options);
        this.updateElement();
        
    }

    createFragment = (markup) => {
        const fragment = document.createRange().createContextualFragment(markup);
        return fragment.firstElementChild;
    }

    getMoment = () => {
        return this.#moment;
    }
    
    getParentEl = () => {
        return this.#parentEl;
    }

    getContainer = () => {
        return this.#container;
    }

    getElement = () => {
        return this.#element;
    }

    getOptions = () => {
        return this.#options;
    }

    getLocale = () => {
        return this.#locale;
    }

    isShowing = () => {
        return this.#isShowing;
    }

    getLeftCalendar = () => {
        return this.#leftCalendar;
    }

    getRightCalendar = () => {
        return this.#rightCalendar;
    }

    #initContainer = () => {

         //html template for the picker UI
        if (_.isEmpty(this.#options.template)){
            this.#options.template =
                `<div class="daterangepicker">
                    <div class="ranges"></div>
                    <div class="drp-calendar left">
                        <div class="calendar-table"></div>
                        <div class="calendar-time"></div>
                    </div>
                    <div class="drp-calendar right">
                        <div class="calendar-table"></div>
                        <div class="calendar-time"></div>
                    </div>
                    <div class="drp-buttons">
                        <span class="drp-selected"></span>
                        <button class="cancelBtn" type="button"></button>
                        <button class="applyBtn" disabled="disabled" type="button"></button> 
                    </div>
                </div>`;
        }

        let parentEl = document.querySelectorAll(this.#options.parentEl);

        this.#parentEl = (parentEl != null && parentEl.length > 0) ? parentEl[0] : null;
           
        this.#container = this.createFragment(this.#options.template);
        // render performance...
        var fragment = document.createDocumentFragment();
        fragment.appendChild(this.#container);

        this.#parentEl.appendChild(fragment);

        //컨테이너가 위치할 방향 설정.
        this.#container.classList.add(this.#locale.direction);
    }


    #initOptions = (options) => {

        // 값이 없을 경우 초기화.
        if(!options) {
            options = options || {};
        }

        if(!options["locale"]){
            options.locale= {};
        }

        this.#options = _.merge(defaulOptions,{
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day'),
            minYear: moment().subtract(100, 'year').format('YYYY'),
            maxYear: moment().add(100, 'year').format('YYYY'),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, options);
        
        this.#locale = _.merge(localeOptions,{
            format: 'YYYY-MM-DD',
            daysOfWeek: moment().localeData().weekdaysMin(),
            monthNames: moment().localeData().monthsShort(),
            firstDay: moment().localeData().firstDayOfWeek()
        }, options.locale);

        // handle all the possible options overriding defaults
        if (typeof options.locale.customRangeLabel === 'string'){
            //Support unicode chars in the custom range name.
            var elem = document.createElement('textarea');
            elem.innerHTML = options.locale.customRangeLabel;
            var rangeHtml = elem.value;
            this.#locale.locale.customRangeLabel = rangeHtml;
        }
    
        this.#initContainer();

        if (typeof options.applyClass === 'string'){ //backwards compat
            this.#options.applyButtonClasses = options.applyClass;
        }
        if (typeof options.cancelClass === 'string') { //backwards compat
            this.#options.cancelButtonClasses = options.cancelClass;
        }

        if (typeof options.buttonClasses === 'object') {
            this.#options.buttonClasses = options.buttonClasses.join(' ');
        }

        //단독으로 달력이 펼쳐질 경우 종료날짜를 시작날짜로 맞춤.
        if (this.#options.singleDatePicker === true) {
            this.#options.endDate = this.#options.startDate.clone();
        }

        // update day names order to firstDay
        if (this.#locale.firstDay != 0) {
            var iterator = this.#locale.firstDay;
            while (iterator > 0) {
                this.#locale.daysOfWeek.push(this.#locale.daysOfWeek.shift());
                iterator--;
            }
        }


        //레이아웃 설정.
        this.#initContainer();

        // 달력창 여는 방향 설정 항목을 초기화 한다.
        this.#initOpensAndDrops();
        // 날짜 관련 항목 초기화. moment 또는 dayjs 객체로 변환.
        this.#initDate();
    }

    /**
     * 달력창 여는 방향 설정 항목을 초기화 한다.
     */
    #initOpensAndDrops = () => {

        if (this.#element.classList.contains('pull-right')){
            this.#options.opens = 'left';
        }

        if (this.#element.classList.contains('dropup')){
            this.#options.drops = 'up';
        }
    }

    /**
     * 날짜 관련 옵션 항목을 초기화 한다.
     */
    #initDate = () => {

        util.date.setDate(moment, this.#options, this.#locale, 'startDate');
        util.date.setDate(moment, this.#options, this.#locale, 'endDate');
        util.date.setDate(moment, this.#options, this.#locale, 'minDate');
        util.date.setDate(moment, this.#options, this.#locale, 'maxDate');

        // sanity check for bad options
        // 최소 날짜가 시작 날짜보다 이전이라면 시작 날짜를 최소 날짜로 설정.
        if (this.#options.minDate && this.#options.startDate.isBefore( this.#options.minDate)){
            this.#options.startDate =  this.#options.minDate.clone();
        }
    
        // sanity check for bad options
        // 종료 날짜가 촤대 날짜보다 이후라면 시작 날짜를 최대 날짜로 설정.
        if ( this.#options.maxDate &&  this.#options.endDate.isAfter( this.#options.maxDate)){
            this.#options.endDate =  this.#options.maxDate.clone();
        }
    
        var start, end, range;

        //if no start/end dates set, check if an input element contains initial values
        if (typeof this.#options.startDate === 'undefined' && typeof this.#options.endDate === 'undefined') {
            if (this.#element === HTMLInputElement && this.#element.type == 'text') {
                var val = this.#element.value,
                    split = val.split(this.#locale.separator);

                start = end = null;

                if (split.length == 2) {
                    start = moment(split[0], this.#locale.format);
                    end = moment(split[1], this.#locale.format);
                } else if (this.#options.singleDatePicker === true && val !== "") {
                    start = moment(val, this.#locale.format);
                    end = moment(val, this.#locale.format);
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end);
                }
            }
        }
    }
    
    
    updateElement = ()  => {
        //input 엘리먼트이고 autoUpdateInput 설정이 true일 경우 처리 한다.
        if (this.#element === HTMLInputElement && this.autoUpdateInput) {
            var newValue =  this.#options.startDate.format(this.locale.format);
            if (! this.#options.singleDatePicker) {
                newValue += this.#locale.separator +  this.#options.endDate.format(this.#locale.format);
            }
            //신규 값과 Input 엘리먼트에 등록된 값이 다를 경우 change이벤트를 발생 시킨다.
            if (newValue !== this.#element.val()) {
                this.#element.value = newValue;

                //@TODO 이벤트 trigger 이벤트 추가 하여야함.
                
            }
        }
    }

    remove = () => {
        this.#container.remove();
        this.#element.off('.daterangepicker');
        this.#element.removeData();
    }

    setStartDate = (startDate) => {

        util.date.setDate( moment, this.#options, this.#locale, 'startDate');

        if (!this.#options.timePicker)
            this.#options.startDate = this.#options.startDate.startOf('day');

        if (this.#options.timePicker && this.#options.timePickerIncrement)
            this.#options.startDate.minute(Math.round(this.#options.startDate.minute() / this.#options.timePickerIncrement) * this.#options.timePickerIncrement);

        if (this.#options.minDate && this.#options.startDate.isBefore(this.#options.minDate)) {
            this.#options.startDate = this.#options.minDate.clone();
            if (this.#options.timePicker && this.#options.timePickerIncrement)
                this.#options.startDate.minute(Math.round(this.#options.startDate.minute() / this.#options.timePickerIncrement) * this.#options.timePickerIncrement);
        }

        if (this.#options.maxDate && this.#options.startDate.isAfter(this.#options.maxDate)) {
            this.#options.startDate = this.#options.maxDate.clone();
            if (this.#options.timePicker && this.#options.timePickerIncrement)
                this.#options.startDate.minute(Math.floor(this.#options.startDate.minute() / this.#options.timePickerIncrement) * this.#options.timePickerIncrement);
        }

        if (!this.#isShowing)
            this.updateElement();

        this.updateMonthsInView();
    }

    setEndDate = (endDate) => {

        util.date.setDate( moment, this.#options, this.#locale, 'endDate');
 
        if (!this.#options.timePicker)
            this.#options.endDate = this.#options.endDate.endOf('day');

        if (this.#options.timePicker && this.#options.timePickerIncrement)
            this.#options.endDate.minute(Math.round(this.#options.endDate.minute() / this.#options.timePickerIncrement) * this.#options.timePickerIncrement);

        if (this.#options.endDate.isBefore(this.#options.startDate))
            this.#options.endDate = this.#options.startDate.clone();

        if (this.#options.maxDate && this.#options.endDate.isAfter(this.#options.maxDate))
            this.#options.endDate = this.#options.maxDate.clone();

        if (this.#options.maxSpan && this.#options.startDate.clone().add(this.#options.maxSpan).isBefore(this.#options.endDate))
            this.#options.endDate = this.#options.startDate.clone().add(this.#options.maxSpan);

            this.#previousRightTime = this.#options.endDate.clone();

        this.container.find('.drp-selected').html(this.#options.startDate.format(this.#locale.format) + this.#locale.separator + this.#options.endDate.format(this.#locale.format));

        if (!this.#isShowing)
            this.updateElement();

        this.updateMonthsInView();
    }

    updateMonthsInView = () => {

        if (this.#options.endDate) {

            //if both dates are visible already, do nothing
            if (!this.#options.singleDatePicker && this.#leftCalendar.month && this.#rightCalendar.month &&
                (this.#options.startDate.format('YYYY-MM') == this.#leftCalendar.month.format('YYYY-MM') || this.#options.startDate.format('YYYY-MM') == this.#rightCalendar.month.format('YYYY-MM'))
                &&
                (this.#options.endDate.format('YYYY-MM') == this.#leftCalendar.month.format('YYYY-MM') || this.#options.endDate.format('YYYY-MM') == this.#rightCalendar.month.format('YYYY-MM'))
                ) {
                return;
            }

            this.#leftCalendar.month = this.#options.startDate.clone().date(2);
            if (!this.#options.linkedCalendars && (this.#options.endDate.month() != this.#options.startDate.month() || this.#options.endDate.year() != this.#options.startDate.year())) {
                this.#rightCalendar.month = this.#options.endDate.clone().date(2);
            } else {
                this.#rightCalendar.month = this.#options.startDate.clone().date(2).add(1, 'month');
            }

        } else {
            if (this.#leftCalendar.month.format('YYYY-MM') != this.#options.startDate.format('YYYY-MM') && this.#rightCalendar.month.format('YYYY-MM') != this.#options.startDate.format('YYYY-MM')) {
                this.#leftCalendar.month = this.#options.startDate.clone().date(2);
                this.#rightCalendar.month = this.#options.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.#options.maxDate && this.#options.linkedCalendars && !this.#options.singleDatePicker && this.#rightCalendar.month > this.#options.maxDate) {
          this.#rightCalendar.month = this.#options.maxDate.clone().date(2);
          this.#leftCalendar.month = this.#options.maxDate.clone().date(2).subtract(1, 'month');
        }
    }
};

export default DatePicker;