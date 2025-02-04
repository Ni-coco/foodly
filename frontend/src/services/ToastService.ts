import { Bounce, toast,ToastOptions } from 'react-toastify';

class ToastService {
    private static defaultOptions: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    static success(message: string): void {
        toast.success(message, this.defaultOptions);
    }

    static warning(message: string): void {
        toast.warn(message, this.defaultOptions);
    }

    static info(message: string): void {
        toast.info(message, this.defaultOptions);
    }

    static error(message: string): void {
        toast.error(message, this.defaultOptions);
    }
}

export default ToastService;