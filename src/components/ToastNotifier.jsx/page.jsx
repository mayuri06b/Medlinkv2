// components/ToastNotifier.jsx
import { toast } from 'react-toastify';

const ToastNotifier = ({ message, type }) => {
    const notify = () => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warning':
                toast.warn(message);
                break;
            default:
                toast(message); // default toast
        }
    };

    // Call notify when the component is rendered
    notify();

    return null; // No UI to render for this component
};

export default ToastNotifier;
