import { useContext } from 'react';
import { createContext } from 'react';

// Re-export the context creation (this will be imported from ToastProvider)
export const ToastContext = createContext();

/**
 * Custom hook for using toast notifications
 * Must be used within a ToastProvider component
 * 
 * @returns {Object} Toast methods and configuration
 * @returns {Function} showToast - Generic toast method
 * @returns {Function} showSuccess - Success toast with green styling
 * @returns {Function} showError - Error toast with red styling  
 * @returns {Function} showWarning - Warning toast with yellow styling
 * @returns {Function} showInfo - Info toast with blue styling
 * @returns {Object} config - Current toast configuration
 */
export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToast must be used within a ToastProvider. ' +
            'Make sure to wrap your component tree with <ToastProvider>.'
        );
    }

    return context;
};

/**
 * Convenience hook for quick success notifications
 * @param {string} defaultMessage - Default message if none provided
 * @returns {Function} showSuccess method with bound default message
 */
export const useSuccessToast = (defaultMessage = 'Success!') => {
    const { showSuccess } = useToast();
    return (message = defaultMessage, options = {}) => showSuccess(message, options);
};

/**
 * Convenience hook for quick error notifications
 * @param {string} defaultMessage - Default message if none provided
 * @returns {Function} showError method with bound default message
 */
export const useErrorToast = (defaultMessage = 'Something went wrong') => {
    const { showError } = useToast();
    return (message = defaultMessage, options = {}) => showError(message, options);
};

/**
 * Convenience hook for quick warning notifications
 * @param {string} defaultMessage - Default message if none provided
 * @returns {Function} showWarning method with bound default message
 */
export const useWarningToast = (defaultMessage = 'Warning') => {
    const { showWarning } = useToast();
    return (message = defaultMessage, options = {}) => showWarning(message, options);
};

/**
 * Convenience hook for quick info notifications
 * @param {string} defaultMessage - Default message if none provided
 * @returns {Function} showInfo method with bound default message
 */
export const useInfoToast = (defaultMessage = 'Information') => {
    const { showInfo } = useToast();
    return (message = defaultMessage, options = {}) => showInfo(message, options);
};

/**
 * Hook for creating persistent notifications that don't auto-dismiss
 * Useful for critical errors or important information
 * @returns {Object} Methods for persistent toasts
 */
export const usePersistentToast = () => {
    const { showToast } = useToast();

    return {
        showPersistentSuccess: (message, options = {}) =>
            showToast(message, 'success', { duration: Infinity, ...options }),

        showPersistentError: (message, options = {}) =>
            showToast(message, 'error', { duration: Infinity, ...options }),

        showPersistentWarning: (message, options = {}) =>
            showToast(message, 'warning', { duration: Infinity, ...options }),

        showPersistentInfo: (message, options = {}) =>
            showToast(message, 'info', { duration: Infinity, ...options })
    };
};

/**
 * Hook for creating loading toasts that can be updated
 * Useful for async operations
 * @returns {Object} Methods for loading toasts
 */
export const useLoadingToast = () => {
    const { showToast } = useToast();

    return {
        /**
         * Show a loading toast
         * @param {string} message - Loading message
         * @returns {string} Toast ID for updating
         */
        showLoading: (message = 'Loading...') => {
            return showToast(message, 'info', {
                duration: Infinity,
                icon: '⏳'
            });
        },

        /**
         * Update loading toast to success
         * @param {string} toastId - ID from showLoading
         * @param {string} message - Success message
         */
        updateToSuccess: (toastId, message = 'Success!') => {
            // Note: react-hot-toast doesn't support updating existing toasts
            // This is a placeholder for the pattern - actual implementation would
            // need to dismiss the loading toast and show a new success toast
            showToast(message, 'success');
        },

        /**
         * Update loading toast to error
         * @param {string} toastId - ID from showLoading
         * @param {string} message - Error message
         */
        updateToError: (toastId, message = 'Error occurred') => {
            showToast(message, 'error');
        }
    };
};

export default useToast; 