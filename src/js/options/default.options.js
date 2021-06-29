/**
 * DateRangePicker 기본 설정.
 */
export default {
 
    //default settings for options
    parentEl: 'body',
    dateLibrary: null,
    element: null,
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
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
    alwaysShowCalendars : false,
    callback: function() { console.log('Hamonica DateRangePicker callback ... ') ;},
    ranges : {},
    
    buttonClasses: 'btn btn-sm',
    applyButtonClasses: 'btn-primary',
    cancelButtonClasses: 'btn-default',

    opens: 'right',
    drops: 'down'
}