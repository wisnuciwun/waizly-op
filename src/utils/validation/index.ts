export const validateRange= (value: string, label: string, minNumber: number) => {
    let message: string = '';
    if(value !== null){
        if(value.length == 0)
            message =  `${label} harus diisi`;
        else if (value.length < minNumber)
            message = `Masukan minimal ${minNumber} karakter`;
    }

    return message;
};

export const validateInputNull = (value: string | number, label: string) => {
    let message: string = '';

    if(value !== null ){
        if(!value)
            message = `${label} harus diisi`;
    }
    return message;
};   