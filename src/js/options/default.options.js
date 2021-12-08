/**
 * DateRangePicker 기본 설정.
 */
export default {
 
    //default settings for options
    parentEl: 'body',
    element: null,
    theme: null,
    darkMode: false,
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
    maxSpan: false,
    autoApply: false,
    singleDatePicker: false,
    showMonthAndYearDropdowns: false,
    minYear: null,
    maxYear: null,
    showWeekNumbers: false,
    showISOWeekNumbers: false,
    showCustomRangeLabel: true,
    timePicker: false,
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

    opens: 'auto',
    drops: 'auto',

    isInvalidDate: (p) => {
        return false;
    },

    isCustomDate: (p) => {
        return false;
    },

    events: {
        startUp: function(e, picker){
            console.log("startUp ",e, picker);
        },
        outsideClick: function(e, picker){
            console.log("outsideClick ",e, picker);
        },
        clickApply: function(e, picker){
            console.log("clickApply ",e, picker);
        },
        clickCancel: function(e, picker){
            console.log("clickCancel ",e, picker);
        },
        show: function(picker){
            console.log("show ", picker);
        },
        hide: function(picker){
            console.log("hide ", picker);
        },
        showCalendars: function(e, picker){
            console.log("showCalendar ",e, picker);
        },
        hideCalendars: function(e, picker){
            console.log("hideCalendars ",e, picker);
        }
    }

}
