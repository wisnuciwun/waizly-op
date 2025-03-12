import jne from '@/assets/images/logo/courier/jne.svg';
import jnt from '@/assets/images/logo/courier/jnt.svg';
import sicepat from '@/assets/images/logo/courier/sicepat.svg';
import ninja from '@/assets/images/logo/courier/ninja.svg';

export const imageCourier = (value: string) => {
    switch(value) {
        case 'NINJA EXPRESS':
            return ninja;
        case 'JNT': 
            return jnt;
        case 'JNE': 
            return jne;
        case 'SiCepat':
            return sicepat;
        default:
            return jnt;
    }
};