export const usePrimeToast = () => {
  const { successToast, errorToast, customToast } = toastMsg();

  const showError = (message) => {
    errorToast(message);
  };

  const showSuccess = (message) => {
    successToast(message);
  };

  return {
    showError,
    showSuccess,
    customToast,
  };
};
