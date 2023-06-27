import { toast, ToastOptions } from "react-toastify";
import { ApiErrResponse } from "../model";

export const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const apiErrorHandler = (err: ApiErrResponse) => {
  if (err.status === 401 || err.status === 403) {
    return toast.warning(err.message, toastOptions);
  } else {
    return toast.error(err.message, toastOptions);
  }
};
