# Hamonica Date Range Picker

![image](https://user-images.githubusercontent.com/2518021/128446475-f3c5e941-05a4-4960-923e-8ec047e3659d.png)

## Intro
>jquery를 이용하여 개발된 daterangepicker를 사용(복제:clone) 하여 만들었습니다.   
>jquery를 제거한 버전이며 몇가지 변경된 사항이 있으니 확인 후 사용하세요.   
>
>------------------------------------------------------------------------------------------------------------
>__I made it by cloning the daterangepicker developed using jquery.__   
__This is a version that has removed jquery, and there are some changes, so please use it after checking it.__


This date range picker component creates a dropdown menu from which a user can
select a range of dates. I created it while building the UI for Hamonica monitoring system,
which needed a way to select date ranges for dahboard or report.

Features include limiting the selectable date range, localizable strings and date formats,
a single date picker mode, a time picker, and predefined date ranges.

http://www.pionnet.co.kr

## Build and Run Server (npm)

  ```bash
  # js, css build:
  npm run build   
  
  # start webpack server:
  npm run serve

  ```


## Changes from Hamonica daterangepicker

- daterangepicker(Dan Grossman):

  ```bash
  # npm 6.x
  showDropdowns : removed option and added showMonthAndYearDropdowns
  ```

- Hamonica daterangepicker:

  ```bash
  showMonthAndYearDropdowns : added option, Same features as the removed showdropdowns option.
  showCalendars : added option.
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
},
  
  ```

## [Documentation and Live Usage Examples](http://www.daterangepicker.com)

## License

***I checked Dan Grossman MIT license at the time of cloning and keep it the same.***   

The MIT License (MIT)

Copyright (c) 2012-2021 JangCool

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
