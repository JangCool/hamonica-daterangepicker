import defaulOptions from './options/default.options';
import localeOptions from './options/default.locale';
import { isEmpty, merge } from 'lodash';
import util from './util/util.date';
import { hide, show, getOffset, css, matches } from './functions/functions';

class DatePicker {
    
    /**
     * dayjs 
     */
    #dayjs;

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

    #outsideClickProxy;

    #oldStartDate;

    #oldEndDate;

    #chosenLabel;

    constructor(dayjs, element, options, cb) {
        
        this.#dayjs = dayjs;

        this.#element = element;

        this.#element.classList.add('hamonica');

        this.#initOptions(options);
        this.updateElement();

        let self = this;

        this.#move();

        window.on("resize.daterangepicker", (e) => {
            self.#move(e);
        })

        // Create a click proxy that is private to this instance of datepicker, for unbinding
        this.#outsideClickProxy = function(e) { self.outsideClick.call(self, e); };

        // Bind global datepicker mousedown for hiding and
        document
            .on('mousedown.daterangepicker', this.#outsideClickProxy)
            // also support mobile devices
            .on('touchend.daterangepicker', this.#outsideClickProxy)
            // and also close when focus changes to outside the picker (eg. tabbing between controls)
            .on('focusin.daterangepicker', this.#outsideClickProxy);
        
        if (this.#element.tagName.toLowerCase() == 'input'|| this.#element.tagName.toLowerCase() == 'button') {
            this.#element
                .on('click.daterangepicker', function(e) { self.show.call(self, e); })
                .on('focus.daterangepicker', function(e) { self.show.call(self, e); })
                .on('keyup.daterangepicker', function(e) { self.elementChanged.call(self, e); })
                .on('keydown.daterangepicker', function(e) { self.keydown.call(self, e); })
   
        } else {
            this.#element
                .on('click.daterangepicker', function(e) { self.toggle.call(self, e); })
                .on('keydown.daterangepicker', function(e) { self.toggle.call(self, e); });
        }
    

        document.on("click",function(e){

           let nodeList = this.querySelectorAll('[data-toggle=dropdown]');

           if(!nodeList){
                return;
           }

           nodeList.forEach(dropdown => {
               // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
               dropdown.on('click.daterangepicker', this.#outsideClickProxy);
                
           });

        });

        const dynamicOn = (selector, eventName, callback) => {

            let elements = this.#container.querySelectorAll(selector);

            elements.forEach((element) => {
                element.on(eventName, function(e){
                    callback(e);
                 });
            });
        }

        dynamicOn('.ranges', 'click.daterangepicker', (e) => {
            if (e.target.closest("li")) {
                self.clickRange.call(self, e);
            }
         });
        dynamicOn('.drp-calendar', 'click.daterangepicker', (e) => {

            if (e.target.closest(".prev")) {
                self.clickPrev.call(self, e);
            }

            if (e.target.closest(".next")) {
                self.clickNext.call(self, e);
            }
         });
        dynamicOn('.drp-calendar', 'mousedown.daterangepicker', (e) => {
            if (e.target.matches("td.available")) {
                self.clickDate.call(self, e);
            }
        });
        dynamicOn('.drp-calendar', 'mouseenter.daterangepicker', (e) => {
            if (e.target.matches("td.available")) {
                self.hoverDate.call(self, e);
            }
        });
        dynamicOn('.drp-calendar', 'change.daterangepicker', (e) => {
            if (e.target.matches("select.yearselect")) {
                self.monthOrYearChanged.call(self, e);
            }
            if (e.target.matches("select.monthselect")) {
                self.monthOrYearChanged.call(self, e);
            }
        });
        dynamicOn('.drp-calendar', 'change.daterangepicker', (e) => {
            if (
                e.target.matches("select.hourselect") ||
                e.target.matches("select.minuteselect") ||
                e.target.matches("select.secondselect") ||
                e.target.matches("select.ampmselect")
            ) {
                self.timeChanged.call(self, e);
            }
        });

        // this.#container.find('.drp-calendar')
        //     .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
        //     .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
        //     .on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
        //     .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
        //     .on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
        //     .on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
        //     .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this));

        let drpbuttons = this.#container.querySelector('.drp-buttons');

        drpbuttons.querySelector('button.btn.apply')
            .on('click.daterangepicker', function(e) { self.clickApply.call(self, e); });
        drpbuttons.querySelector('button.btn.cancel')
            .on('click.daterangepicker', function(e) { self.clickCancel.call(self, e); });


        //엘리먼트 업데이트
        this.updateElement();


    }

    createFragment = (markup) => {
        const fragment = document.createRange().createContextualFragment(markup);
        return fragment.firstElementChild;
    }

    getDayjs = () => {
        return this.#dayjs;
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
    
    getOldStartDate = () => {
        return this.#oldStartDate;
    }

    getOldEndDate = () => {
        return this.#oldEndDate;
    }
    

  

    #initContainer = () => {

         //html template for the picker UI
        if (isEmpty(this.#options.template)){
            this.#options.template =
                `<div class="hamonica daterangepicker">
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
                        <button class="btn cancel" type="button"></button>
                        <button class="btn apply" disabled="disabled" type="button"></button> 
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

        //달력 보여주기 옵션이 true이면 show-calendar 적용
        if (this.#options.showCalendars) {
            this.#container.classList.add('show-calendar');
        }else{
            this.#container.classList.remove('show-calendar');
        }

        //정의된 범위 항목이 있을 경우 show-range 추가.
        if (this.#options.showRanges){

            //달력 하나일때는 범위 항목을 출력하지 않는다.
            if(!this.#options.singleDatePicker){
                this.#container.classList.add('show-ranges');
            }
        }

        //하나의 달력만 출력할 경우.
        //왼쪽에 지정된 달력만 출력하고 오른쪽 영역의 달력은 숨긴다.
        if (this.#options.singleDatePicker) {
            this.#container.classList.add('single');
            this.#container.querySelector('.drp-calendar.left').classList.add('single');
            show(this.#container.querySelector('.drp-calendar.left'));
            hide(this.#container.querySelector('.drp-calendar.right'));

            //시간 선택 옵션이 false 이고 자동 적용 옵션이 true이면 auto-apply 적용.
            if (!this.#options.timePicker && this.#options.autoApply) {
                this.#container.classList.add('auto-apply');
            }
        }


        //apply CSS classes and labels to buttons
        const setClassesAndLabelsToButtons = (element, isContain, label, classes) => {
            if(isContain === true){
                element.innerHTML = label ;
                if (classes != null && classes != '' ){
                    element.classList.add(classes);
                }
            }
        }

        this.#container
            .querySelectorAll('.btn.apply, .btn.cancel')
                .forEach((element) => { 

                    element.classList.add(this.#options.buttonClasses);

                    setClassesAndLabelsToButtons(element, element.classList.contains('apply'), this.#locale.applyLabel, this.#options.applyButtonClasses);
                    setClassesAndLabelsToButtons(element, element.classList.contains('cancel'), this.#locale.cancelLabel, this.#options.cancelButtonClasses);

                });
    }

    /**
     * 달력창 여는 방향 설정 항목을 초기화 한다.
     */
    #initOpensAndDrops = () => {


        this.#container.classList.add('opens' + this.#options.opens);


        if (this.#element.classList.contains('pull-right')){
            this.#options.opens = 'left';
        }

        if (this.#element.classList.contains('dropup')){
            this.#options.drops = 'up';
        }
    }

    #initOptions = (options) => {

        let dayjs = this.#dayjs;
        
        // 값이 없을 경우 초기화.
        if(!options) {
            options = options || {};
        }

        if(!options["locale"]){
            options.locale= {};
        }
        //국제화처리.
        this.#dayjs.locale(options.locale.i18n || 'en');

        this.#options = merge(
            merge({}, defaulOptions),
            defaulOptions,
            {
                startDate: dayjs().startOf('day'),
                endDate: dayjs().endOf('day'),
                minYear: dayjs().subtract(100, 'year').format('YYYY'),
                maxYear: dayjs().add(100, 'year').format('YYYY'),
                ranges: {
                    'Today': [dayjs(), dayjs()],
                    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
                    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
                    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
                    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
                    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
                }
            
        }, options);

        if(typeof this.#options.ranges == 'function'){
            this.#options.ranges = this.#options.ranges(dayjs);
        }else{
            console.warn("only function is supported.");
        }
        
        this.#locale = merge(
            merge({}, localeOptions),
            {
                daysOfWeek: dayjs().localeData().weekdaysMin(),
                monthNames: dayjs().localeData().monthsShort(),
                firstDay: dayjs().localeData().firstDayOfWeek()
            }, 
            options.locale,
            {
                format: (function(opt) {

                    if(opt.locale.format){
                        return opt.locale.format;
                    }

                    let format = 'YYYY-MM-DD';
                    if(opt.timePicker){

                        let hour12 = opt.timePicker24Hour? 'HH': 'hh';
                        let ampm = opt.timePicker24Hour ? '' : 'A'
                        let seconds = opt.timePickerSeconds ? ':ss' : ''

                        format = `YYYY-MM-DD ${hour12}:mm${seconds} ${ampm}`;
                    }

                    return `${format}`;

                })(this.#options)
            }
        );

        // handle all the possible options overriding defaults
        if (typeof options.locale.customRangeLabel === 'string'){
            //Support unicode chars in the custom range name.
            var elem = document.createElement('textarea');
            elem.innerHTML = options.locale.customRangeLabel;
            var rangeHtml = elem.value;
            this.#locale.locale.customRangeLabel = rangeHtml;
        }
    
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

        //날짜 범위 선택 항목이 false 인데 달력보여주는 항목도 false이면 달력을 기본으로 노출한다.
        if (this.#options.showRanges === false && this.#options.showCalendars === false) {
            this.#options.showCalendars = true;
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
        // 날짜 관련 항목 초기화. dayjs 또는 dayjs 객체로 변환.
        this.#initDate();


    }

    /**
     * 컨테이너 위치 조정.
     */
    #move = () => {
        var parentOffset = { top: 0, left: 0 },
            containerTop,
            drops = this.#options.drops;

        var parentRightEdge = window.innerWidth;// 브라우저 뷰포트 너비 (세로 스크롤 막대 포함, 여백 포함, 테두리 또는 여백 제외)

        if (!matches(this.#parentEl,'body')) {

            let parentEloffset = getOffset(this.#parentEl);
            parentOffset = {
                top: parentEloffset.top - this.#parentEl.scrollTop,
                left: parentEloffset.left - this.#parentEl.scrollLeft
            };
            parentRightEdge = this.#parentEl.clientWidth + parentEloffset.left;
        }


        let elementOffset = getOffset(this.#element);

        switch (drops) {
        case 'auto':
            containerTop = elementOffset.top + this.#element.offsetHeight - parentOffset.top;
            if (containerTop + this.#container.offsetHeight >= this.#parentEl.scrollHeight) {
                containerTop = elementOffset.top - this.#container.offsetHeight - parentOffset.top;
                drops = 'up';
            }
            break;
        case 'up':
            containerTop = elementOffset.top - this.#container.offsetHeight - parentOffset.top;
            break;
        default:
            containerTop = elementOffset.top + this.#element.offsetHeight - parentOffset.top;
            break;
        }

        // Force the container to it's actual width
        css( this.#container, {
          top: 0,
          left: 0,
          right: 'auto'
        });

        var containerWidth = this.#container.offsetWidth;

       this.#container.classList.toggle('drop-up', drops == 'up' );

        let windowWidth = window.innerWidth;

        if (this.#options.opens == 'left') {
            var containerRight = parentRightEdge - elementOffset.left - this.#element.offsetWidth;

            if (containerWidth + containerRight > windowWidth) {
                css( this.#container, {
                    top: containerTop+'px',
                    right: 'auto',
                    left: 9+'px'
                });
            } else {
                css( this.#container, {
                    top: containerTop+'px',
                    right: containerRight+'px',
                    left: 'auto'
                });
            }
        } else if (this.opens == 'center') {
            var containerLeft = elementOffset.left - parentOffset.left + this.#element.offsetWidth / 2
                                    - containerWidth / 2;
            if (containerLeft < 0) {
                css( this.#container, {
                    top: containerTop+'px',
                    right: 'auto',
                    left: 9+'px'
                });
            } else if (containerLeft + containerWidth > windowWidth) {
                css( this.#container, {
                    top: containerTop+'px',
                    left: 'auto',
                    right: 0
                });
            } else {
                css( this.#container, {
                    top: containerTop+'px',
                    left: containerLeft+'px',
                    right: 'auto'
                });
            }
        } else {
            var containerLeft = elementOffset.left - parentOffset.left;
            if (containerLeft + containerWidth > windowWidth) {
                css( this.#container, {
                    top: containerTop+'px',
                    left: 'auto',
                    right: 0
                });
            } else {
                css( this.#container, {
                    top: containerTop+'px',
                    left: containerLeft+'px',
                    right: 'auto'
                });
            }
        }
    }


    /**
     * 날짜 관련 옵션 항목을 초기화 한다.
     */
    #initDate = () => {

        let dayjs = this.#dayjs;

        util.date.setDate(dayjs, this.#options, this.#locale, 'startDate');
        util.date.setDate(dayjs, this.#options, this.#locale, 'endDate');
        util.date.setDate(dayjs, this.#options, this.#locale, 'minDate');
        util.date.setDate(dayjs, this.#options, this.#locale, 'maxDate');

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
                    start = dayjs(split[0], this.#locale.format);
                    end = dayjs(split[1], this.#locale.format);
                } else if (this.#options.singleDatePicker === true && val !== "") {
                    start = dayjs(val, this.#locale.format);
                    end = dayjs(val, this.#locale.format);
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end);
                }
            }
        }
    }
    
    elementChanged = ()  => {

        let dayjs = this.#dayjs;

        if (!matches(this.#element, 'input')) return;
        if (!this.#element.value.length) return;

        var dateString = this.#element.value.split(this.#locale.separator),
            start = null,
            end = null;

        if (dateString.length === 2) {
            start = dayjs(dateString[0], this.#locale.format);
            end = dayjs(dateString[1], this.#locale.format);
        }

        if (this.#options.singleDatePicker || start === null || end === null) {
            start = dayjs(this.#element.value, this.#locale.format);
            end = start;
        }

        if (!start.isValid() || !end.isValid()) return;

        this.setStartDate(start);
        this.setEndDate(end);
        this.updateView();
    }

    keydown = (e)  => {
        //hide on tab or enter
        if ((e.keyCode === 9) || (e.keyCode === 13)) {
            this.hide();
        }

        //hide on esc and prevent propagation
        if (e.keyCode === 27) {
            e.preventDefault();
            e.stopPropagation();

            this.hide();
        }
    }
    
    updateElement = ()  => {
        //input 엘리먼트이고 autoUpdateInput 설정이 true일 경우 처리 한다.
        if (this.#element instanceof HTMLInputElement  && this.#options.autoUpdateInput) {

            console.log("updateElement")
            var newValue =  this.#options.startDate.format(this.#locale.format);
            if (! this.#options.singleDatePicker) {
                newValue += this.#locale.separator +  this.#options.endDate.format(this.#locale.format);
            }
            //신규 값과 Input 엘리먼트에 등록된 값이 다를 경우 change이벤트를 발생 시킨다.
            if (newValue !== this.#element.value) {
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

        let dayjs = this.#dayjs;

        util.date.setDate( dayjs, this.#options, this.#locale, 'startDate', startDate);

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

        let dayjs = this.#dayjs;

        util.date.setDate( dayjs, this.#options, this.#locale, 'endDate', endDate);
 
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

        this.#container.querySelector('.drp-selected').innerHTML = (this.#options.startDate.format(this.#locale.format) + this.#locale.separator + this.#options.endDate.format(this.#locale.format));

        if (!this.#isShowing)
            this.updateElement();

        this.updateMonthsInView();
    }

    updateView = () => {


        let options = this.#options;

        if (options.timePicker) {
            this.renderTimePicker('left');
            this.renderTimePicker('right');

            let calendarTimeSelect = this.#container.querySelector('.right .calendar-time select');

            if (!options.endDate) {
                calendarTimeSelect.disabled = true;
                calendarTimeSelect.classList.add('disabled');
            } else {
                calendarTimeSelect.disabled = false;
                calendarTimeSelect.classList.remove('disabled');
            }
        }
        if (this.#options.endDate){
            this.#container.querySelector('.drp-selected').innerHTML = this.#options.startDate.format(this.#locale.format) + this.#locale.separator + this.#options.endDate.format(this.#locale.format);
        }

        this.updateMonthsInView();
        this.updateCalendars();
        this.updateFormInputs();
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

    updateCalendars = () => {


        let ctn  = this.#container;
        let options = this.#options;

        if (options.timePicker) {
            var hour, minute, second;
            if (options.endDate) {
                hour = parseInt(ctn.querySelector('.left .hourselect').value, 10);
                minute = parseInt(ctn.querySelector('.left .minuteselect').value, 10);
                if (isNaN(minute)) {
                    minute = parseInt(ctn.querySelector('.left .minuteselect option:last-child').value, 10);
                }
                second = options.timePickerSeconds ? parseInt(ctn.querySelector('.left .secondselect').value, 10) : 0;
                if (!options.timePicker24Hour) {
                    var ampm = ctn.querySelector('.left .ampmselect').value;
                    if (ampm === 'PM' && hour < 12)
                        hour += 12;
                    if (ampm === 'AM' && hour === 12)
                        hour = 0;
                }
            } else {
                hour = parseInt(ctn.querySelector('.right .hourselect').value, 10);
                minute = parseInt(ctn.querySelector('.right .minuteselect').value, 10);
                if (isNaN(minute)) {
                    minute = parseInt(ctn.querySelector('.right .minuteselect option:last-child').value, 10);
                }
                second = options.timePickerSeconds ? parseInt(ctn.querySelector('.right .secondselect').value, 10) : 0;
                if (!options.timePicker24Hour) {
                    var ampm = ctn.querySelector('.right .ampmselect').value;
                    if (ampm === 'PM' && hour < 12)
                        hour += 12;
                    if (ampm === 'AM' && hour === 12)
                        hour = 0;
                }
            }

            this.#leftCalendar.month = this.#leftCalendar.month.hour(hour).minute(minute).second(second);
            this.#rightCalendar.month = this.#rightCalendar.month.hour(hour).minute(minute).second(second);
        }

        this.renderCalendar('left');
        this.renderCalendar('right');

        //highlight any predefined range matching the current start and end dates
        ctn.querySelectorAll('.ranges li').forEach((element) => { element.classList.remove('active') });
        if (options.endDate == null) return;

        this.calculateChosenLabel();
    }

    renderCalendar = (side) => {

        let dayjs = this.#dayjs;

        //
        // Build the matrix of dates that will populate the calendar
        //

        let options = this.#options;
        let locale = this.#locale;

        let leftCalendar = this.#leftCalendar;
        let rightCalendar = this.#rightCalendar;

        var calendar = side == 'left' ? leftCalendar : rightCalendar;
        var month = calendar.month.month();
        var year = calendar.month.year();
        var hour = calendar.month.hour();
        var minute = calendar.month.minute();
        var second = calendar.month.second();
        var daysInMonth = dayjs([year, month]).daysInMonth();
        var firstDay = dayjs([year, month, 1]);
        var lastDay = dayjs([year, month, daysInMonth]);
        var lastMonth = dayjs(firstDay).subtract(1, 'month').month();
        var lastYear = dayjs(firstDay).subtract(1, 'month').year();
        var daysInLastMonth = dayjs([lastYear, lastMonth]).daysInMonth();
        var dayOfWeek = firstDay.day();

        //initialize a 6 rows x 7 columns array for the calendar
        var calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;

        for (var i = 0; i < 6; i++) {
            calendar[i] = [];
        }

        //populate the calendar with date objects
        var startDay = daysInLastMonth - dayOfWeek + locale.firstDay + 1;
        if (startDay > daysInLastMonth)
            startDay -= 7;

        if (dayOfWeek == locale.firstDay)
            startDay = daysInLastMonth - 6;

        var curDate = dayjs([lastYear, lastMonth, startDay, 12, minute, second]);

        var col, row;
        for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = dayjs(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);

            curDate = curDate.hour(12);

            if (options.minDate && calendar[row][col].format('YYYY-MM-DD') == options.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(options.minDate) && side == 'left') {
                calendar[row][col] = options.minDate.clone();
            }

            if (options.maxDate && calendar[row][col].format('YYYY-MM-DD') == options.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(options.maxDate) && side == 'right') {
                calendar[row][col] = options.maxDate.clone();
            }

        }


        //make the calendar object available to hoverDate/clickDate
        if (side == 'left') {
            leftCalendar.calendar = calendar;
        } else {
            rightCalendar.calendar = calendar;
        }

        //
        // Display the calendar
        //

        var minDate = side == 'left' ? options.minDate : options.startDate;
        var maxDate = options.maxDate;
        var selected = side == 'left' ? options.startDate : options.endDate;
        var arrow = locale.direction == 'ltr' ? {left: 'chevron-left', right: 'chevron-right'} : {left: 'chevron-right', right: 'chevron-left'};

        var html = '<table class="table-condensed">';
        html += '<thead>';
        html += '<tr>';

        // add empty cell for week number
        if (options.showWeekNumbers || options.showISOWeekNumbers){
            html += '<th></th>';
        }

        if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!options.linkedCalendars || side == 'left')) {
            html += '<th class="prev available"><span></span></th>';
        } else {
            html += '<th></th>';
        }

        var dateHtml = locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");
        if(locale.i18n == 'ko'){
            dateHtml = calendar[1][1].format(" YYYY") + (locale.yearLabel || '') +' ' +locale.monthNames[calendar[1][1].month()];
        }

        if (options.showDropdowns) {
            var currentMonth = calendar[1][1].month();
            var currentYear = calendar[1][1].year();
            var maxYear = (maxDate && maxDate.year()) || (options.maxYear);
            var minYear = (minDate && minDate.year()) || (options.minYear);
            var inMinYear = currentYear == minYear;
            var inMaxYear = currentYear == maxYear;

            var monthHtml = '<select class="monthselect">';
            for (var m = 0; m < 12; m++) {
                if ((!inMinYear || (minDate && m > minDate.month())) && (!inMaxYear || (maxDate && m <= maxDate.month()))) {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        ">" + locale.monthNames[m] + "</option>";
                } else {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        " disabled='disabled'>" + locale.monthNames[m] + "</option>";
                }
            }
            monthHtml += "</select>";

            var yearHtml = '<select class="yearselect">';
            for (var y = minYear; y <= maxYear; y++) {
                yearHtml += '<option value="' + y + '"' +
                    (y === currentYear ? ' selected="selected"' : '') +
                    '>' + y + '</option>';
            }
            yearHtml += '</select>';

            dateHtml = monthHtml + yearHtml;
        }

        html += '<th colspan="5" class="month">' + dateHtml + '</th>';
        if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!options.linkedCalendars || side == 'right' || options.singleDatePicker)) {
            html += '<th class="next available"><span></span></th>';
        } else {
            html += '<th></th>';
        }

        html += '</tr>';
        html += '<tr>';

        // add week number label
        if (options.showWeekNumbers || options.showISOWeekNumbers)
            html += '<th class="week">' + locale.weekLabel + '</th>';

        locale.daysOfWeek.forEach(function(dayOfWeek,index) {
            html += '<th>' + dayOfWeek + '</th>';
        });

        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        //adjust maxDate to reflect the maxSpan setting in order to
        //grey out end dates beyond the maxSpan
        if (options.endDate == null && options.maxSpan) {
            var maxLimit = options.startDate.clone().add(options.maxSpan).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }

        for (var row = 0; row < 6; row++) {
            html += '<tr>';

            // add week number
            if (options.showWeekNumbers)
                html += '<td class="week">' + calendar[row][0].week() + '</td>';
            else if (options.showISOWeekNumbers)
                html += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

            for (var col = 0; col < 7; col++) {

                var classes = [];

                //highlight today's date
                if (calendar[row][col].isSame(new Date(), "day"))
                    classes.push('today');

                //highlight weekends
                if (calendar[row][col].isoWeekday() == 6){
                    classes.push('weekend');
                    classes.push('saturday');
                }

                //highlight weekends
                if (calendar[row][col].isoWeekday() > 6){
                    classes.push('weekend');
                    classes.push('sunday');
                }

                //grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() != calendar[1][1].month())
                    classes.push('off', 'ends');

                //don't allow selection of dates before the minimum date
                if (options.minDate && calendar[row][col].isBefore(options.minDate, 'day'))
                    classes.push('off', 'disabled');

                //don't allow selection of dates after the maximum date
                if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
                    classes.push('off', 'disabled');

                //don't allow selection of date if a custom function decides it's invalid
                if (options.isInvalidDate(calendar[row][col]))
                    classes.push('off', 'disabled');

                //highlight the currently selected start date
                if (calendar[row][col].format('YYYY-MM-DD') == options.startDate.format('YYYY-MM-DD'))
                    classes.push('active', 'start-date');

                //highlight the currently selected end date
                if (options.endDate != null && calendar[row][col].format('YYYY-MM-DD') == options.endDate.format('YYYY-MM-DD'))
                    classes.push('active', 'end-date');

                //highlight dates in-between the selected dates
                if (options.endDate != null && calendar[row][col] > options.startDate && calendar[row][col] < options.endDate)
                    classes.push('in-range');

                //apply custom classes for this date
                var isCustom = options.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string')
                        classes.push(isCustom);
                    else
                        Array.prototype.push.apply(classes, isCustom);
                }

                var cname = '', disabled = false;
                for (var i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] == 'disabled')
                        disabled = true;
                }

                if (!disabled){
                    cname += 'available';
                }

                
                html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';

            }
            html += '</tr>';
        }

        html += '</tbody>';
        html += '</table>';

        this.#container.querySelector('.drp-calendar.' + side + ' .calendar-table').innerHTML = html;

    }

    renderTimePicker = (side) => {

        let options = this.#options;

        // Don't bother updating the time picker if it's currently disabled
        // because an end date hasn't been clicked yet
        if (side == 'right' && !options.endDate) return;

        var html, selected, minDate, maxDate = options.maxDate;

        if (options.maxSpan && (!options.maxDate || options.startDate.clone().add(options.maxSpan).isBefore(options.maxDate)))
            maxDate = options.startDate.clone().add(options.maxSpan);

        if (side == 'left') {
            selected = options.startDate.clone();
            minDate = options.minDate;
        } else if (side == 'right') {
            selected = options.endDate.clone();
            minDate = options.startDate;

            //Preserve the time already selected
            var timeSelector = this.#container.querySelector('.drp-calendar.right .calendar-time');
            if (timeSelector.innerHTML != '') {

                selected = selected.hour(!isNaN(selected.hour()) ? selected.hour() : timeSelector.querySelector('.hourselect option:checked').value)
                                    .minute(!isNaN(selected.minute()) ? selected.minute() : timeSelector.querySelector('.minuteselect option:checked').value)
                                    .second(!isNaN(selected.second()) ? selected.second() : timeSelector.querySelector('.secondselect option:checked').value);

                if (!options.timePicker24Hour) {
                    var ampm = timeSelector.querySelector('.ampmselect option:checked').value;
                    if (ampm === 'PM' && selected.hour() < 12)
                        selected = selected.hour(selected.hour() + 12);
                    if (ampm === 'AM' && selected.hour() === 12)
                        selected = selected.hour(0);
                }

            }

            if (selected.isBefore(options.startDate))
                selected = options.startDate.clone();

            if (maxDate && selected.isAfter(maxDate))
                selected = maxDate.clone();

        }
console.log(selected, 'selected')
        //
        // hours
        //

        html = '<select class="hourselect">';

        var start = options.timePicker24Hour ? 0 : 1;
        var end = options.timePicker24Hour ? 23 : 12;

        for (var i = start; i <= end; i++) {
            var i_in_24 = i;
            if (!options.timePicker24Hour)
                i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);

            var time = selected.clone().hour(i_in_24);
            var disabled = false;
            if (minDate && time.minute(59).isBefore(minDate))
                disabled = true;
            if (maxDate && time.minute(0).isAfter(maxDate))
                disabled = true;

            if (i_in_24 == selected.hour() && !disabled) {
                html += '<option value="' + i + '" selected="selected">' + i + '</option>';
            } else if (disabled) {
                html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
            } else {
                html += '<option value="' + i + '">' + i + '</option>';
            }
        }

        html += '</select> ';

        //
        // minutes
        //

        html += ': <select class="minuteselect">';

        for (var i = 0; i < 60; i += options.timePickerIncrement) {
            var padded = i < 10 ? '0' + i : i;
            var time = selected.clone().minute(i);

            var disabled = false;
            if (minDate && time.second(59).isBefore(minDate))
                disabled = true;
            if (maxDate && time.second(0).isAfter(maxDate))
                disabled = true;

            if (selected.minute() == i && !disabled) {
                html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
            } else if (disabled) {
                html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
            } else {
                html += '<option value="' + i + '">' + padded + '</option>';
            }
        }

        html += '</select> ';

        //
        // seconds
        //

        if (options.timePickerSeconds) {
            html += ': <select class="secondselect">';

            for (var i = 0; i < 60; i++) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().second(i);

                var disabled = false;
                if (minDate && time.isBefore(minDate))
                    disabled = true;
                if (maxDate && time.isAfter(maxDate))
                    disabled = true;

                if (selected.second() == i && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                } else {
                    html += '<option value="' + i + '">' + padded + '</option>';
                }
            }

            html += '</select> ';
        }

        //
        // AM/PM
        //

        if (!options.timePicker24Hour) {
            html += '<select class="ampmselect">';

            var am_html = '';
            var pm_html = '';

            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
                am_html = ' disabled="disabled" class="disabled"';

            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
                pm_html = ' disabled="disabled" class="disabled"';

            if (selected.hour() >= 12) {
                html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
            } else {
                html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
            }

            html += '</select>';
        }

        this.#container.querySelector('.drp-calendar.' + side + ' .calendar-time').innerHTML = html;

    }

    //callback 함수 호출 시 range 기능이 확성화 되어있을 경우 선택된 레이블값 반환.
    calculateChosenLabel = () => {

        let options = this.#options;
        let locale = this.#locale;

        var customRange = true;
        var i = 0;

        let rangesLi = this.#container.querySelectorAll('.ranges li');

        for (var range in options.ranges) {
          if (options.timePicker) {
                var format = options.timePickerSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
                //ignore times when comparing dates if time picker seconds is not enabled
                if (options.startDate.format(format) == options.ranges[range][0].format(format) && options.endDate.format(format) == options.ranges[range][1].format(format)) {
                    customRange = false;
                    rangesLi[i].classList.add('active');
                    this.#chosenLabel = rangesLi[i].getAttribute('data-range-key');
                    break;
                }
            } else {
                //ignore times when comparing dates if time picker is not enabled
                if (options.startDate.format('YYYY-MM-DD') == options.ranges[range][0].format('YYYY-MM-DD') && options.endDate.format('YYYY-MM-DD') == options.ranges[range][1].format('YYYY-MM-DD')) {
                    customRange = false;
                    rangesLi[i].classList.add('active');
                    this.#chosenLabel = rangesLi[i].getAttribute('data-range-key');
                    break;
                }
            }
            i++;
        }
        if (customRange) {
            if (options.showCustomRangeLabel) {
                let lastLi = this.#container.querySelector('.ranges li:last-child');
                lastLi.classList.add('active');
                this.#chosenLabel = lastLi.getAttribute('data-range-key');
            } else {
                this.#chosenLabel = null;
            }
            this.showCalendars();
        }
    }

    updateFormInputs = () => {

        if (this.#options.singleDatePicker || (this.#options.endDate && (this.#options.startDate.isBefore(this.#options.endDate) || this.#options.startDate.isSame(this.#options.endDate)))) {
            this.#container.querySelector('button.btn.apply').disabled = false;
        } else {
            this.#container.querySelector('button.btn.cancel').disabled = true;
        }

    }


    showCalendars = () => {

        if(!this.#options.showCalendars){
            return;
        }

        this.#container.classList.add('show-calendar');
        this.#move();
        this.getOptions().events.showCalendars(this);
    }

    hideCalendars = () => {
        this.#container.classList.remove('show-calendar');
        this.getOptions().events.hideCalendars(this);
    }

    clickRange = (e) => {

        let options = this.#options;
        let locale = this.#locale;

        var label = e.target.getAttribute('data-range-key');
        this.#chosenLabel = label;
        if (label == locale.customRangeLabel) {
            this.showCalendars();
        } else {
            var dates = options.ranges[label];
            options.startDate = dates[0];
            options.endDate = dates[1];

            if (!options.timePicker) {
                options.startDate.startOf('day');
                options.endDate.endOf('day');
            }

            if (!options.alwaysShowCalendars)
                this.hideCalendars();
            this.clickApply();
        }
    }

    clickPrev = (e) => {
        var cal = e.target.closest('.drp-calendar');
        
        if (cal.classList.contains('left')) {

            this.#leftCalendar.month = this.#leftCalendar.month.subtract(1, 'month');

            if (this.#options.linkedCalendars)
                this.#rightCalendar.month = this.#rightCalendar.month.subtract(1, 'month');
        } else {
            this.#rightCalendar.month = this.#rightCalendar.month.subtract(1, 'month');
        }

        this.updateCalendars();
    }

    clickNext = (e) => {
        var cal = e.target.closest('.drp-calendar');
        if (cal.classList.contains('left')) {
            this.#leftCalendar.month = this.#leftCalendar.month.add(1, 'month');
        } else {
            this.#rightCalendar.month = this.#rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars){
                this.#leftCalendar.month = this.#leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    hoverDate = (e) => {

        //ignore dates that can't be selected
        if (!e.target.classList.contains('available')) return;

        var title = e.target.getAttribute('data-title');
        var row = title.substr(1, 1);
        var col = title.substr(3, 1);
        var cal = e.target.closest('.drp-calendar');
        var date = cal.classList.contains('left') ? this.#leftCalendar.calendar[row][col] : this.#rightCalendar.calendar[row][col];

        let options = this.#options;
        //highlight the dates between the start date and the date being hovered as a potential end date
        var leftCalendar = this.#leftCalendar;
        var rightCalendar = this.#rightCalendar;
        var startDate = options.startDate;

        if (!options.endDate) {
            alert("Cc")
            this.#container.querySelectorAll('.drp-calendar tbody td').forEach(function(el,index) {

                //skip week numbers, only look at dates
                if (el.classList.contains('week')) return;

                var title = el.getAttribute('data-title');
                var row = title.substr(1, 1);
                var col = title.substr(3, 1);
                var cal = el.closest('.drp-calendar');
                var dt = cal.classList.contains('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                if ((dt.isAfter(startDate) && dt.isBefore(date)) || dt.isSame(date, 'day')) {
                    el.classList.add('in-range');
                } else {
                    el.classList.remove('in-range');
                }

            });
        }

    }

    clickDate = (e) => {
        if (!e.target.classList.contains('available')) return;
        var title = e.target.getAttribute('data-title');
        var row = title.substr(1, 1);
        var col = title.substr(3, 1);
        var cal = e.target.closest('.drp-calendar');
        var date = cal.classList.contains('left') ? this.#leftCalendar.calendar[row][col] : this.#rightCalendar.calendar[row][col];

        let options = this.#options;

        //
        // this function needs to do a few things:
        // * alternate between selecting a start and end date for the range,
        // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
        // * if autoapply is enabled, and an end date was chosen, apply the selection
        // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
        // * if one of the inputs above the calendars was focused, cancel that manual input
        //

        if (options.endDate || date.isBefore(options.startDate, 'day')) { //picking start

            if (options.timePicker) {
                var hour = parseInt(this.#container.querySelector('.left .hourselect').value, 10);
                if (!options.timePicker24Hour) {
                    var ampm = this.#container.querySelector('.left .ampmselect').value;
                    if (ampm === 'PM' && hour < 12)
                        hour += 12;
                    if (ampm === 'AM' && hour === 12)
                        hour = 0;
                }
                var minute = parseInt(this.#container.querySelector('.left .minuteselect').value, 10);
                if (isNaN(minute)) {
                    minute = parseInt(this.#container.querySelector('.left .minuteselect option:last-child').value, 10);
                }
                var second = this.timePickerSeconds ? parseInt(this.#container.querySelector('.left .secondselect').value, 10) : 0;
                date = date.clone().hour(hour).minute(minute).second(second);
            }
            options.endDate = null;
            this.setStartDate(date.clone());
        } else if (!options.endDate && date.isBefore(options.startDate)) {
            //special case: clicking the same date for start/end,
            //but the time of the end date is before the start date
            this.setEndDate(options.startDate.clone());
        } else { // picking end
            if (options.timePicker) {
                var hour = parseInt(this.#container.querySelector('.right .hourselect').value, 10);
                if (!options.timePicker24Hour) {
                    var ampm = this.#container.querySelector('.right .ampmselect').value;
                    if (ampm === 'PM' && hour < 12)
                        hour += 12;
                    if (ampm === 'AM' && hour === 12)
                        hour = 0;
                }
                var minute = parseInt(this.#container.querySelector('.right .minuteselect').value, 10);
                if (isNaN(minute)) {
                    minute = parseInt(this.#container.querySelector('.right .minuteselect option:last-child').value, 10);
                }
                var second = options.timePickerSeconds ? parseInt(this.#container.querySelector('.right .secondselect').value, 10) : 0;
                date = date.clone().hour(hour).minute(minute).second(second);
            }
            this.setEndDate(date.clone());
            if (options.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }

        if (options.singleDatePicker) {
            this.setEndDate(options.startDate);
            if (!options.timePicker && options.autoApply)
                this.clickApply();
        }

        this.updateView();

        //This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();

    }

    show = (e) => {
        if (this.#isShowing) return;

        this.#oldStartDate = this.#options.startDate.clone();
        this.#oldEndDate = this.#options.endDate.clone();
        this.#previousRightTime = this.#options.endDate.clone();

        this.updateView();
        show(this.#container);
        this.#move();
        this.getOptions().events.show(e, this);
        this.#isShowing = true;
    }

    hide = (e) => {

        if (!this.#isShowing) return;

        //incomplete date selection, revert to last values
        if (!this.#options.endDate) {
            this.#options.startDate = this.#oldStartDate.clone();
            this.#options.endDate = this.#oldEndDate.clone();
        }

        //if a new date range was selected, invoke the user callback function
        if (!this.#options.startDate.isSame(this.#oldStartDate) || !this.#options.endDate.isSame(this.#oldEndDate))
            this.#options.callback(this.#options.startDate.clone(), this.#options.endDate.clone(), this.#chosenLabel);

        //if picker is attached to a text input, update it
        this.updateElement();

    
        window.off('resize.daterangepicker');

        hide(this.#container);
        this.getOptions().events.hide(e, this);
        this.#isShowing = false;
    }


    toggle = (e) => {
        if (this.#isShowing) {
            this.hide();
        } else {
            this.show();
        }
    }

    outsideClick = (e) => {
        var target = e.target;

        if (!this.#isShowing) return;

        // if the page is clicked anywhere except within the daterangerpicker/button
        // itself then call this.hide()
        if (
            // ie modal dialog fix
            e.type == "focusin" ||
            target.closest('.hamonica') ||
            target.closest('.hamonica.daterangepicker') ||
            target.closest('.hamonica.calendar-table')
            ) return;
            
        this.hide();
        this.getOptions().events.outsideClick(e, this);
    }
    
    clickApply = (e) => {
        this.hide();
        this.getOptions().events.clickApply(e, this);
    }

    clickCancel = (e) => {
        this.getOptions().startDate = this.getOldStartDate();
        this.getOptions().endDate = this.getOldEndDate();
        this.hide();
        this.getOptions().events.clickCancel(e, this);
    }

    monthOrYearChanged = (e) => {
        var isLeft = e.target.closest('.drp-calendar').classList.contains('left'),
            leftOrRight = isLeft ? 'left' : 'right',
            cal = this.#container.querySelector('.drp-calendar.'+leftOrRight);

        // Month must be Number for new moment versions
        var month = parseInt(cal.querySelector('.monthselect').value, 10);
        var year = cal.querySelector('.yearselect').value;
        let options = this.#options;


        if (!isLeft) {
            if (year < options.startDate.year() || (year == options.startDate.year() && month < options.startDate.month())) {
                month = options.startDate.month();
                year = options.startDate.year();
            }
        }

        if (options.minDate) {
            if (year < options.minDate.year() || (year == options.minDate.year() && month < options.minDate.month())) {
                month = options.minDate.month();
                year = options.minDate.year();
            }
        }

        if (options.maxDate) {
            if (year > options.maxDate.year() || (year == options.maxDate.year() && month > options.maxDate.month())) {
                month = options.maxDate.month();
                year = options.maxDate.year();
            }
        }

        if (isLeft) {
            this.#leftCalendar.month = this.#leftCalendar.month.month(month).year(year);
            if (options.linkedCalendars)
                this.#rightCalendar.month = this.#leftCalendar.month.clone().add(1, 'month');

        } else {
            this.#rightCalendar.month = this.#rightCalendar.month.month(month).year(year);
            if (options.linkedCalendars)
                this.#leftCalendar.month = this.#rightCalendar.month.clone().subtract(1, 'month');
        }
        this.updateCalendars();
    }

    timeChanged = (e) => {

        let options = this.#options;

        var cal = e.target.closest('.drp-calendar'),
            isLeft = cal.classList.contains('left');

        var hour = parseInt(cal.querySelector('.hourselect').value, 10);
        var minute = parseInt(cal.querySelector('.minuteselect').value, 10);
        if (isNaN(minute)) {
            minute = parseInt(cal.querySelector('.minuteselect option:last-child').value, 10);
        }

        var second = options.timePickerSeconds ? parseInt(cal.querySelector('.secondselect').value, 10) : 0;

        if (!options.timePicker24Hour) {
            var ampm = cal.querySelector('.ampmselect').value;
            if (ampm === 'PM' && hour < 12)
                hour += 12;
            if (ampm === 'AM' && hour === 12)
                hour = 0;
        }

        if (isLeft) {
            var start = options.startDate.clone();

            start = start.hour(hour).minute(minute).second(second);

            this.setStartDate(start);

            if (options.singleDatePicker) {
                options.endDate = options.startDate.clone();
            } else if (options.endDate && options.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && options.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        } else if (options.endDate) {
            var end = options.endDate.clone();
            end = end.hour(hour).minute(minute).second(second);
            this.setEndDate(end);
        }

        //update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();

        //update the form inputs above the calendars with the new time
        this.updateFormInputs();

        //re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker('left');
        this.renderTimePicker('right');

    }
}
export default DatePicker;