

const util = {
    text :{

        isEmpty: function(str) {
            return str == null || str == undefined || str == "";
        },
        
        isBlank: function(str) {
            return this.isEmpty(str) || !this.isEmpty(str) && str.trim().length == 0;
        }
    },

    date :{

        /**
         * Option 값으로 날짜 데이터를 moment 또는 dayjs 유형으로 변경 한다.
         * 
         * @param {*} dateLibrary  moment or dayjs
         * @param {*} options 설정 값
         * @param {*} locale 지역 설정 값.
         * @param {*} field 날짜 데이터 속성.
         * @param {*} newDate 새로 지정할 값.
         */
        setDate(dayjs, options, locale, field, newDate) {

            let target = newDate ? newDate : options[field];

            if (typeof target === 'string'){
                if(target){
                    options[field] = dayjs(target, locale.format)                
                }
            }

            if (typeof target === 'object'){
                if(target){
                    options[field] = dayjs(target);
                }
            }
        }
    },
    

}

export default util;