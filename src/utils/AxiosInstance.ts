import axios from 'axios';
import { infoMessage } from 'messages/infoMessages';
import { Theme, toast } from 'react-toastify';

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => {
    toast.clearWaitingQueue();
    toast.dismiss(4);
    return response;
  },
  (error) => {
    const theme = localStorage.getItem('themeMode') || 'light';

    if (error.message === infoMessage.NETWORK_ERROR.message) {
      toast.error(infoMessage.NETWORK_ERROR.message, {
        toastId: 4,
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        isLoading: true,
        theme: theme as Theme,
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
