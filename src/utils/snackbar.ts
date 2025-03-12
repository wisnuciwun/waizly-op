import { ToastPosition, toast } from 'react-toastify';

export const snackBar = (
    type: 'success' | 'warn' | 'error', 
    message: string, 
    position: ToastPosition, 
    autoClose: number | false,
    marginLeft?: number,
) => {
    toast[type](message,{
        position: position,
        autoClose: autoClose,
        style: {
            marginLeft
        },
    },
);
};