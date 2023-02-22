import React from 'react';
import useEscapeKey from '../../hooks/useEscapeKey';
const ToastContext = React.createContext();

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  useEscapeKey(() => toasts.forEach((toast) => toast.dismiss()));

  const addToast = React.useCallback(function addToast(message, variant) {
    const id = crypto.randomUUID();
    setToasts((ts) => [
      ...ts,
      {
        message,
        variant,
        id,
        dismiss: () => {
          setToasts((ts) => ts.filter((toast) => id !== toast.id));
        },
      },
    ]);
  }, []);

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
    }),
    [addToast, toasts]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToasts() {
  const value = React.useContext(ToastContext);

  if (!value) {
    throw new Error('useToasts must be used inside of a ToastProvider!');
  }

  return value;
}

export default ToastProvider;
