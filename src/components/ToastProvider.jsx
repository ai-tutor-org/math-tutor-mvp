import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { ToastContext } from '../hooks/toast/useToast';
import './ToastProvider.css';

// Default configuration
const defaultConfig = {
    duration: 5000, // Consistent 5 seconds for all toasts
    position: 'top-right',
    // Default messages can be overridden via props
    messages: {
        success: 'Success!',
        error: 'Something went wrong',
        warning: 'Warning',
        info: 'Information'
    },
    style: {
        background: '#2a2a2a', // Matches your app's dark theme
        color: 'rgba(255, 255, 255, 0.87)', // Matches your app's text color
        border: '1px solid #404040',
        borderRadius: '8px',
        fontSize: '14px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',

    }
};

// Toast Provider Component
export const ToastProvider = ({
    children,
    config = {},
    messages = {}
}) => {
    // Merge user config with defaults
    const finalConfig = {
        ...defaultConfig,
        ...config,
        messages: {
            ...defaultConfig.messages,
            ...messages
        }
    };

    // Toast methods
    const showToast = (message, type = 'info', options = {}) => {
        const toastOptions = {
            duration: finalConfig.duration,
            style: finalConfig.style,
            ...options
        };

        switch (type) {
            case 'success':
                return toast.success(message, {
                    ...toastOptions,
                    style: {
                        ...toastOptions.style,
                        border: '1px solid #38a169'
                    },
                    iconTheme: {
                        primary: '#38a169',
                        secondary: '#e2e8f0'
                    }
                });
            case 'error':
                return toast.error(message, {
                    ...toastOptions,
                    style: {
                        ...toastOptions.style,
                        border: '1px solid #e53e3e'
                    },
                    iconTheme: {
                        primary: '#e53e3e',
                        secondary: '#e2e8f0'
                    }
                });
            case 'warning':
                return toast(message, {
                    ...toastOptions,
                    icon: '⚠️',
                    style: {
                        ...toastOptions.style,
                        border: '1px solid #d69e2e'
                    }
                });
            case 'info':
            default:
                return toast(message, {
                    ...toastOptions,
                    icon: 'ℹ️',
                    style: {
                        ...toastOptions.style,
                        border: '1px solid #3182ce'
                    }
                });
        }
    };

    const showSuccess = (message = finalConfig.messages.success, options = {}) => {
        return showToast(message, 'success', options);
    };

    const showError = (message = finalConfig.messages.error, options = {}) => {
        return showToast(message, 'error', options);
    };

    const showWarning = (message = finalConfig.messages.warning, options = {}) => {
        return showToast(message, 'warning', options);
    };

    const showInfo = (message = finalConfig.messages.info, options = {}) => {
        return showToast(message, 'info', options);
    };

    // Context value
    const contextValue = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        config: finalConfig
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <Toaster
                position={finalConfig.position}
                toastOptions={{
                    duration: finalConfig.duration,
                    style: finalConfig.style
                }}
                containerClassName="toast-container"
                containerStyle={{
                    top: 20,
                    right: 20,
                    left: 'auto',
                    bottom: 'auto'
                }}
                gutter={8}
            >
                {(t) => (
                    <div
                        style={{
                            ...finalConfig.style,
                            ...t.style,
                            display: 'flex',
                            alignItems: 'center',
                            animation: t.visible
                                ? 'toast-enter-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                : 'toast-exit-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        }}
                    >
                        {/* Icon */}
                        {t.icon && (
                            <span style={{ marginRight: '8px', flexShrink: 0 }}>
                                {t.icon}
                            </span>
                        )}

                        {/* Message */}
                        <span style={{
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {typeof t.message === 'string'
                                ? t.message
                                : typeof t.message === 'function'
                                    ? t.message(t)
                                    : t.message
                            }
                        </span>
                    </div>
                )}
            </Toaster>
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
    config: PropTypes.shape({
        duration: PropTypes.number,
        position: PropTypes.oneOf([
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-center',
            'bottom-right'
        ]),
        style: PropTypes.object
    }),
    messages: PropTypes.shape({
        success: PropTypes.string,
        error: PropTypes.string,
        warning: PropTypes.string,
        info: PropTypes.string
    })
};

// useToast hook is now in ../hooks/useToast.js

export default ToastProvider; 