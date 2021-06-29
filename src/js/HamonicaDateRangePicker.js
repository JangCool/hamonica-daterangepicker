import defaulOptions from './options/default.options';
import localeOptions from './options/default.locale';
import DateRangePicker from './DateRangePicker';
import RangePicker from './interfaces/RangePicker';



/**
 * 
 * @param {*} element 엘리먼트
 * @param {*} options 옵션
 * @param {*} cb 콜백
 */
class HamonicaDateRangePicker {

    #elems = [];
    #length;

    constructor(element, options, cb){

        this.#initElement(element, options, cb);
    }

    #initElement(element, options, cb) {

        //날짜 객체 임시 보관.
        let tempElems = null;

        //문자열일 경우에 querySelectorAll 함수를 이용하여 반환.
        if(typeof element == "string"){
            tempElems = document.querySelectorAll(element);
        }

        //날짜 객체 보관함에 등록.
        tempElems.forEach(element => {
            this.#elems.push(new DateRangePicker(element, options, cb));
        });

        this.#length = this.#elems.length;
    }

    remove = () => {

        this.#elems.forEach(element => {
            element.remove();
        });
    }

};


const datePicker = (element, options, cb) => {
    return new HamonicaDateRangePicker(element, options, cb);
}

const dateRangePicker = (element, options, cb) => {
    return new HamonicaDateRangePicker(element, options, cb);
}

export {
    datePicker,
    dateRangePicker
} 