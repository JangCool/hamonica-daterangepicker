

const util = {

    date :{

        /**
         * Option 값으로 날짜 데이터를 moment 또는 dayjs 유형으로 변경 한다.
         * 
         * @param {*} dateLibrary  moment or dayjs
         * @param {*} options 설정 값
         * @param {*} locale 지역 설정 값.
         * @param {*} field 날짜 데이터 속성.
         */
        setDate(dayjs, options, locale, field) {
            if (typeof options[field] === 'string'){
                if(options[field]){
                    options[field] = dayjs(options[field], locale.format)                
                }
            }

            if (typeof options[field] === 'object'){
                if(options[field]){
                    options[field] = dayjs(options[field]);
                }
            }
        }
    },
    

}

export default util;