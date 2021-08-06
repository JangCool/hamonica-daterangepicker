import DateRangePicker from './DateRangePicker';
import './DatePickerEvent'

import dayjs from 'dayjs';
import "dayjs/locale/ko";
import "dayjs/locale/ko";
import "dayjs/locale/es-us";

import utc from "dayjs/plugin/utc";
import localeDate from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import arraySupport from "dayjs/plugin/arraySupport";

dayjs.extend(localeDate);
dayjs.extend(utc);
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(arraySupport)

/**
 * 
 * @param {*} element 엘리먼트
 * @param {*} options 옵션
 * @param {*} cb 콜백
 */

const dateRangePicker = (element, options, cb) => {

    //문자열일 경우에 querySelectorAll 함수를 이용하여 반환.
    if(typeof element == "string"){
        element = document.querySelector(element);
        console.warn("Select only one element. When multiple elements are selected, they are applied to the first element.");
    }
            
    return new DateRangePicker(dayjs, element, options, cb);
}


export {
    dateRangePicker
} 