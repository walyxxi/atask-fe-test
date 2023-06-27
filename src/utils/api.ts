import { toast, ToastOptions } from "react-toastify";
import { ApiErrResponse } from "../model";

export const apiErrorHandler = (err: ApiErrResponse) => {
  const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  if (err.status === 401 || err.status === 403) {
    return toast.warning(err.message, toastOptions);
  } else {
    return toast.error(err.message, toastOptions);
  }
};
