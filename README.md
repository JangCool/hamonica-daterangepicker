# Hamonica Date Range Picker

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fhttps%2F%2Fgithub.com%2FJangCool%2Fhamonica-daterangepicker%2Fhit-counter&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

 - normal mode:
> ![image](https://user-images.githubusercontent.com/2518021/128446475-f3c5e941-05a4-4960-923e-8ec047e3659d.png)
   
 - dark mode:
> ![image](https://user-images.githubusercontent.com/2518021/128463582-86ae25c1-0da7-42cc-8ec8-1d1338d32c1a.png)


## Intro
>jquery를 이용하여 개발된 daterangepicker를 사용(복제:clone) 하여 만들었습니다. (https://github.com/dangrossman/daterangepicker.git)      
>jquery를 제거한 버전이며 몇가지 변경된 사항이 있으니 확인 후 사용하세요.   
>
>------------------------------------------------------------------------------------------------------------
>__I made it by cloning the daterangepicker developed using jquery. (https://github.com/dangrossman/daterangepicker.git)__    
__This is a version that has removed jquery, and there are some changes, so please use it after checking it.__


This date range picker component creates a dropdown menu from which a user can
select a range of dates. I created it while building the UI for Hamonica monitoring system,
which needed a way to select date ranges for dahboard or report.

Features include limiting the selectable date range, localizable strings and date formats,
a single date picker mode, a time picker, and predefined date ranges.


## Build and Run Server (npm)

  ```bash
  # js, css build:
  npm run build   
  
  # start webpack server:
  npm run serve

  ```


## Changes from Hamonica daterangepicker

- daterangepicker options (Dan Grossman):

  ```bash
  showDropdowns : removed option and added showMonthAndYearDropdowns
  ```

- Hamonica daterangepicker options:

  ```bash
  showMonthAndYearDropdowns : added option, Same features as the removed showdropdowns option.
  showCalendars : added option. right calendars show/hide.
  showRanges : added option, left ranges show/hide.
  ranges: (dayjs) => {
    return {
        'Today': [dayjs(), dayjs()],
        'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
        '7일 전': [dayjs().subtract(6, 'days'), dayjs()],
        '30일 전': [dayjs().subtract(29, 'days'), dayjs()],
        '이번 달': [dayjs().startOf('month'), dayjs().endOf('month')],
        '지난 달': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
    } : changed option, Used only as a function. It takes a dayjs object as a parameter.
  }
  
  ```
  
- Create daterangepicker (script tag):
```
<script src="daterangepicker.min.js"></script>
<link href="daterangepicker.min.css" rel="stylesheet">

  const datetime = dateRangePicker(
      document.querySelector("#datetime"),
      {
          singleDatePicker: false,
          events: {
              outsideClick: (e, picker) => {
                  console.log("outsideClick ", e, picker);
              },
              clickApply: (e, picker) => {
                  console.log("clickApply ", e, picker);
              },
              clickCancel: (e, picker) => {
                  console.log("clickCancel ", e, picker);
              }
          }
      }
  );
```

- Create daterangepicker (es6 module):
```
import { dateRangePicker } from '@/assets/js/daterangepicker/daterangepicker.min.js'
import '@/assets/css/daterangepicker/daterangepicker.min.css'

 const datetime = dateRangePicker(
      document.querySelector("#datetime"),
      {
          ...
      }
 );
```

## Options - dateRangePicker(element, options) 

  ```bash
{
 
    //default settings for options
    parentEl: 'body',
    element: null,
    theme: null,     //setTheme(''|'dark')
    darkMode: false, //setDarkMode(true|false)
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
    maxSpan: false,
    autoApply: false,
    singleDatePicker: false,
    showMonthAndYearDropdowns: true,
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
    showRanges : true,
    ranges : {},
    locale: {
        i18n : 'en',
        direction: 'ltr',
        format: null,
        separator: ' ~ ',
        daysOfWeek: null,
        monthNames: null,
        firstDay: null,
        yearLabel : null,
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        customRangeLabel: 'Custom Range'

    },
   
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


  ```

## [Documentation and Live Usage Examples](http://www.daterangepicker.com)

## Thanks to
- [Lodash](https://lodash.com/)
- [day.js](https://day.js.org/)
- and other support...

## License

***I checked Dan Grossman MIT license at the time of cloning and keep it the same.***   

The MIT License (MIT)

Copyright (c) 2021 JangCool

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
