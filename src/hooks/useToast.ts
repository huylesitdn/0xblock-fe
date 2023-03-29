import { customToast, OverrideToastOption } from 'helpers/customToast';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
  const toastRef = useRef<any>();
  const createToast = (data: OverrideToastOption) => {
    // create toast
    toastRef.current = customToast(data);
    // clear toast queue
    toast.clearWaitingQueue(toastRef.current);
  };
  return {
    createToast,
    currentToast: toastRef.current,
  };
};
