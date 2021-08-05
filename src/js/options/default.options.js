/**
 * DateRangePicker 기본 설정.
 */
export default {
 
    //default settings for options
    parentEl: 'body',
    element: null,
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
    maxSpan: false,
    autoApply: true,
    singleDatePicker: false,
    showDropdowns: false,
    minYear: null,
    maxYear: null,
    showWeekNumbers: false,
    showISOWeekNumbers: false,
    showCustomRangeLabel: true,
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 1,
    timePickerSeconds: true,
    linkedCalendars: false,
    autoUpdateInput: true,
    alwaysShowCalendars : false,
    showCalendars: true,
    showRanges : false,
    ranges : {},
    locale: null,
   
    buttonClasses: null,
    applyButtonClasses: null,
    cancelButtonClasses: null,

    opens: 'right',
    drops: 'down',

    isInvalidDate: (p) => {
        return false;
    },

    isCustomDate: (p) => {
        return false;
    },

    callback: function() { console.log('Hamonica DateRangePicker callback ... ') ;},

    events: {
        /**
         * 달력과 관련없는 외부 영역을 클릭했을 경우 호출.
         * 
         * @param {Event} e 
         * @param {DatePicker} picker 
         */
        outsideClick: function(e, picker){
            console.log("outsideClick ",e, picker);
        },
        clickApply: function(e, picker){
            console.log("clickApply ",e, picker);
        },
        clickCancel: function(e, picker){
            console.log("clickCancel ",e, picker);
        },
        show: function(e, picker){
            console.log("show ",e, picker);
        },
        hide: function(e, picker){
            console.log("hide ",e, picker);
        },
        showCalendars: function(e, picker){
            console.log("showCalendar ",e, picker);
        },
        hideCalendars: function(e, picker){
            console.log("hideCalendars ",e, picker);
        }
    }

}
