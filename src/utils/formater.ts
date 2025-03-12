// import { _.isEmpty} from "lodash"
import _ from 'lodash';
import { ProductSingelProps } from './type/product';
import { FormEvent } from 'primereact/ts-helpers';
import moment from 'moment';
import emojiRegex from 'emoji-regex';

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

export const getVariantProduct = (first: string | null, second: string | null, third: string | null) => {

    if(first || second || third)
        return `${first ? first : ''} ${second ? ', ' +second : ''} ${third ? ', ' + third : ''}`;

    return '-';
};

export const changeEmptyToDash = (value: string) => {
    if(_.isEmpty(value)) {
        return '-';
    }

    return value;
};

export const checkSameData = (value: any, compareValue: any) => {
    const valueString = JSON.stringify(value);
    const compareString = JSON.stringify(compareValue);
    if(valueString === compareString) {
        return true;
    } 

    return false; 
};

export const checkStatus = (value: number) => {
    return [200, 201].includes(value);
};

export const UseDelay = async (time: number) => new Promise(resolve => setTimeout(resolve, time));

export const lastPath = (value: string) =>{
    return value.substring(value.lastIndexOf('/') + 1);
}; 

export const checkValueListNull = (value: ProductSingelProps[]) => {
    let isNull: boolean = false;

    value.forEach((data) => {
        if(isNaN(data.quantity) || data.quantity == 0 || data.quantity == null) {
            isNull = true;
        } 
    });

    return isNull;
};

export const checkArrayIncludes = (array: ProductSingelProps[]) => {
    let valid: boolean = false;

    array.forEach((data, index) => {
        if(data.quantity != valid[index]) {
            valid = true;
        }
    });

    return valid;
};

export const checkEmptyValueInObject = (value: object) => {
    let empty: boolean = false;
    for(var key in value) {
        if(_.isEmpty(value[key])) {
           empty = true;
        }
    }

    return empty;
};

export const checkNotEmptyValueInObject = (value: object) => {
    let notEmpty: boolean = false;
    for(var key in value) {
        if(value[key]) {
            notEmpty = true;
        }
    }

    return notEmpty;
};


export const curencyRupiah = (amount: number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
    });
    return formatter.format(amount);
};

export const inputNumber = (input: string, maxLength: number) => {
    const value = input.startsWith('0') ? '' : input.replace(/[^0-9]/g, '');
    const maxInput = value.substring(0, maxLength);
    return maxInput;
};

export const inputNumberAllowZeroNumber = (input: string, maxLength: number) => {
    const value = input.replace(/[^0-9]/g, '');
    const maxInput = value.substring(0, maxLength);
    return maxInput;
};

export const inputNumberAllowZeroNumberWithoutDoubleZero = (input: any, maxLength: number) => {
    let value = input.replace(/[^0-9]/g, ''); 
    if (value.startsWith('0') && value.length > 1) {
        value = '0'; 
    }
    const maxInput = value.substring(0, maxLength); 
    return maxInput;
};


export const formatPhone = (e: FormEvent) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/^0+/, '');
    e.target.value = inputValue.slice(0, 13).replace(/[^0-9]/g, '');
};


export const emailValidation = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
};

export const checkSapace = (value: string) => {
    if(/^\s/.test(value))
        return '';
    else return value;
};

export const clearEmoji = (value: string) => {
    const emoji = emojiRegex();
    // if(emoji.test(value)){
    //     return '';
    // }
    // return value
    return value.replace(emoji, '');
};

export const clearSpace = (e: FormEvent) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(' ', '');
    inputValue = clearEmoji(inputValue);
    e.target.value = inputValue;
};

export const clearEmojiInput = (e: FormEvent | any) => {
    let inputValue = e.target.value;
    inputValue = clearEmoji(inputValue);
    e.target.value = inputValue;
};

export const convertDate = (date: Date) => {
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
};

export const getLastPath = () => {
    return parseInt(lastPath(window.location.href));
};

export const formateTime = (value: number) => {
    return value < 10 ? '0'+value : value;
};

export const countWeight = (value: number) => {
    if(value){
        if(value/1000 < 1) {
            return 1;
        }else {
            return value / 1000;
        }
    } else return 0;
};

export const getEstimationDate = (time: number, toDate: number) => {
    const date = moment.unix(time).add(toDate, 'days').format('DD MMM');

    return date.toString();
};

export const changeFirtChar = (value: string) => {

    const toLower = value.toLowerCase();
    return toLower.replace(/\w\S*/g, function(kata: string){ 
        const kataBaru = kata.slice(0,1).toUpperCase() + kata.substr(1);
        return kataBaru;
    });

};

export const reductionDate = (value: number) : Date => {
    let date = new Date();
    date.setDate(date.getDate() - value);
    return date;
};

export const incraseDate = (dates: any, value: number) : Date => {
    let date = new Date(dates);
    date.setDate(date.getDate() + value);
    return date;
    
};

export const incraseMonth = (dates: any, value: number) : Date => {
    let date = new Date(dates);
    date.setMonth(date.getMonth() + value);
    return date;
    
};

export const decraseMonth = (dates: any, value: number) : Date => {
    let date = new Date(dates);
    date.setMonth(date.getMonth() - value);
    return date;
    
};

export const getDeferentDate = (from: string, to: any) => {
    let dateFrom = moment(from).add(7, 'hours');;
    let dateTo = moment(to);
    return dateTo.diff(dateFrom, 'days');
};

export const formatDateForURL = (date: any) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const getDeferentTime = (from: any, to: any) => {
    let dateFrom = moment(from);
    let dateTo = moment(to);
    return dateTo.diff(dateFrom, 'minutes');
};

export const titleCase = (value: string) => {
    var splitStr = value.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 };
 

export const getTimeStampDate = (date: string | number) => {
    const result = new Date(date).getTime();

    return typeof (date) === 'number' ? date : result / 1000;
};

export const changeToFormatPhone = (value: string) => {
    let phoneNumber = '';
    if(!value.includes('+62')) {
        if(value.substring(0,1) === '0') {
            const phone = value.slice(1);
            phoneNumber = `+62${phone}`;
        }else {
            phoneNumber = `+62${value}`;
        }
    }else {
        phoneNumber = value;
    }

    return phoneNumber;
};

export const removeComa = (value: string) : number => {
    const convert = parseInt(value).toFixed(0);
    return parseInt(convert);
};

export const inputDecimal = (value: string): string => {
    // let number and decimal
    let inputValue = value.replace(/[^0-9.]/g, '');
    const parts = inputValue.split('.');
    if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
    }
    // delete if value start with decimal
    if (inputValue.startsWith('.')) {
        inputValue = inputValue.replace(/\./g, '');
    }
     // delete if value start witch double "00"
     if (/^0[0-9]+/.test(inputValue)) {
        inputValue = inputValue.replace(/^0+/, '0');
    }

    return inputValue;
};

export const formatDateYearAndMonth = (dateString: string) => {
    const date = new Date(dateString);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
};

export function capitalize(string: string) {
    let strVal = '';
    const str = string.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
      strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' ';
    }
    return strVal;
}
