/**
 * NotificationService - Centralized notification management
 * 
 * This service provides a centralized way to manage notifications across
 * the entire platform (lessons, chapters, classes). It handles queuing,
 * error fallbacks, and provides consistent notification patterns.
 */

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Notification priorities for queue management
export const NOTIFICATION_PRIORITIES = {
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    CRITICAL: 4
};

// Default notification configurations - all 5 seconds for consistency
const DEFAULT_CONFIGS = {
    [NOTIFICATION_TYPES.SUCCESS]: {
        duration: 5000,
        priority: NOTIFICATION_PRIORITIES.NORMAL
    },
    [NOTIFICATION_TYPES.ERROR]: {
        duration: 5000,
        priority: NOTIFICATION_PRIORITIES.HIGH
    },
    [NOTIFICATION_TYPES.WARNING]: {
        duration: 5000,
        priority: NOTIFICATION_PRIORITIES.HIGH
    },
    [NOTIFICATION_TYPES.INFO]: {
        duration: 5000,
        priority: NOTIFICATION_PRIORITIES.NORMAL
    }
};

class NotificationService {
    constructor() {
        this.queue = [];
        this.activeNotifications = new Set();
        this.maxConcurrent = 3; // Maximum concurrent notifications
        this.toastProvider = null; // Will be set when provider is available
        this.fallbackHandler = this.consoleFallback.bind(this);
        this.isProcessing = false;
    }

    /**
     * Initialize the service with a toast provider
     * @param {Object} toastProvider - Toast provider with show methods
     */
    initialize(toastProvider) {
        this.toastProvider = toastProvider;
        this.processQueue(); // Process any queued notifications
    }

    /**
     * Show a notification with automatic queuing and error handling
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Notification ID
     */
    async show(message, type = NOTIFICATION_TYPES.INFO, options = {}) {
        const notification = this.createNotification(message, type, options);

        try {
            if (this.shouldQueue(notification)) {
                return this.queueNotification(notification);
            } else {
                return await this.displayNotification(notification);
            }
        } catch (error) {
            console.error('NotificationService: Failed to show notification', error);
            this.fallbackHandler(notification, error);
            return null;
        }
    }

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Notification ID
     */
    showSuccess(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.SUCCESS, options);
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Notification ID
     */
    showError(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.ERROR, options);
    }

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Notification ID
     */
    showWarning(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.WARNING, options);
    }

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Notification ID
     */
    showInfo(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.INFO, options);
    }

    /**
     * Create notification object with defaults
     * @private
     */
    createNotification(message, type, options) {
        const defaultConfig = DEFAULT_CONFIGS[type] || DEFAULT_CONFIGS[NOTIFICATION_TYPES.INFO];

        return {
            id: this.generateId(),
            message,
            type,
            timestamp: Date.now(),
            priority: options.priority || defaultConfig.priority,
            duration: options.duration || defaultConfig.duration,
            persistent: options.persistent || false,
            metadata: options.metadata || {},
            ...options
        };
    }

    /**
     * Check if notification should be queued
     * @private
     */
    shouldQueue(notification) {
        return this.activeNotifications.size >= this.maxConcurrent ||
            this.isProcessing ||
            !this.toastProvider;
    }

    /**
     * Add notification to queue
     * @private
     */
    queueNotification(notification) {
        // Insert based on priority (higher priority first)
        const insertIndex = this.queue.findIndex(
            queued => queued.priority < notification.priority
        );

        if (insertIndex === -1) {
            this.queue.push(notification);
        } else {
            this.queue.splice(insertIndex, 0, notification);
        }

        // Process queue if not already processing
        if (!this.isProcessing) {
            setTimeout(() => this.processQueue(), 100);
        }

        return notification.id;
    }

    /**
     * Process the notification queue
     * @private
     */
    async processQueue() {
        if (this.isProcessing || !this.toastProvider) {
            return;
        }

        this.isProcessing = true;

        while (this.queue.length > 0 && this.activeNotifications.size < this.maxConcurrent) {
            const notification = this.queue.shift();
            try {
                await this.displayNotification(notification);
            } catch (error) {
                console.error('NotificationService: Failed to display queued notification', error);
                this.fallbackHandler(notification, error);
            }
        }

        this.isProcessing = false;
    }

    /**
     * Display a notification using the toast provider
     * @private
     */
    async displayNotification(notification) {
        if (!this.toastProvider) {
            throw new Error('Toast provider not initialized');
        }

        this.activeNotifications.add(notification.id);

        try {
            let toastId;
            const { message, type, duration, persistent } = notification;
            const toastOptions = {
                duration: persistent ? Infinity : duration
            };

            switch (type) {
                case NOTIFICATION_TYPES.SUCCESS:
                    toastId = this.toastProvider.showSuccess(message, toastOptions);
                    break;
                case NOTIFICATION_TYPES.ERROR:
                    toastId = this.toastProvider.showError(message, toastOptions);
                    break;
                case NOTIFICATION_TYPES.WARNING:
                    toastId = this.toastProvider.showWarning(message, toastOptions);
                    break;
                case NOTIFICATION_TYPES.INFO:
                default:
                    toastId = this.toastProvider.showInfo(message, toastOptions);
                    break;
            }

            // Remove from active set after duration (if not persistent)
            if (!persistent) {
                setTimeout(() => {
                    this.activeNotifications.delete(notification.id);
                    this.processQueue(); // Process any queued notifications
                }, duration);
            }

            return notification.id;
        } catch (error) {
            this.activeNotifications.delete(notification.id);
            throw error;
        }
    }

    /**
     * Console fallback when toast provider fails
     * @private
     */
    consoleFallback(notification, error) {
        const timestamp = new Date(notification.timestamp).toISOString();
        const prefix = `[${timestamp}] NotificationService Fallback (${notification.type.toUpperCase()}):`;

        console.group(prefix);
        console.log('Message:', notification.message);
        console.log('Original Error:', error);
        console.log('Notification Object:', notification);
        console.groupEnd();

        // For critical errors, also use alert as last resort
        if (notification.priority === NOTIFICATION_PRIORITIES.CRITICAL) {
            alert(`${notification.type.toUpperCase()}: ${notification.message}`);
        }
    }

    /**
     * Generate unique notification ID
     * @private
     */
    generateId() {
        return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Clear all queued notifications
     */
    clearQueue() {
        this.queue = [];
    }

    /**
     * Get queue status
     */
    getQueueStatus() {
        return {
            queued: this.queue.length,
            active: this.activeNotifications.size,
            maxConcurrent: this.maxConcurrent,
            isProcessing: this.isProcessing
        };
    }

    /**
     * Set custom fallback handler
     * @param {Function} handler - Custom fallback function
     */
    setFallbackHandler(handler) {
        if (typeof handler === 'function') {
            this.fallbackHandler = handler;
        }
    }

    /**
     * Configure maximum concurrent notifications
     * @param {number} max - Maximum concurrent notifications
     */
    setMaxConcurrent(max) {
        if (typeof max === 'number' && max > 0) {
            this.maxConcurrent = max;
        }
    }
}

// Create singleton instance
const notificationService = new NotificationService();

// Export singleton instance and class for testing
export { NotificationService };
export default notificationService; 