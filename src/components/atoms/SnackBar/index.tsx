import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export interface ISnackbarProps {
}

export default function Toast () {

  return (
    <ToastContainer
      hideProgressBar
      autoClose={5000}
    />
  );
}
