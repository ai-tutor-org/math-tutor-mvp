/**
 * LessonHookManager - Dynamic hook loading and management
 * 
 * This class manages the loading of lesson-specific React hooks based on
 * lesson configuration. It ensures hooks are called properly within React's
 * lifecycle while supporting dynamic lesson types.
 * 
 * IMPORTANT: This maintains React compliance by using static imports
 * and conditional hook calling at the top level of components.
 */

// Static imports for all available hooks
// New hooks for future lessons can be added here
import usePerimeterInput from '../hooks/usePerimeterInput.js';
import useMeasurementInput from '../hooks/useMeasurementInput.js';
import useShapeDesignInput from '../hooks/useShapeDesignInput.js';
// Future lesson hooks:
// import useFractionInput from '../hooks/useFractionInput';
// import usePieChartInput from '../hooks/usePieChartInput';

/**
 * Hook registry - maps hook names to actual hook functions
 * This is the central place to register new hooks for lessons
 */
const HOOK_MAP = {
  usePerimeterInput,
  useMeasurementInput,
  useShapeDesignInput,
  // Future hooks will be added here:
  // useFractionInput,
  // usePieChartInput
};


export class LessonHookManager {
  constructor() {
    this.loadedHooks = new Map();
    this.hookInstances = new Map();
  }

  /**
   * Load hooks for a specific lesson based on configuration
   * This method is designed to be called from within a React component
   * using useMemo to ensure hooks are called at the top level
   * 
   * @param {Object} lessonConfig - Lesson configuration with hooks array
   * @returns {Object} Object with hook instances keyed by hook key
   */
  static loadHooksForLesson(lessonConfig) {
    if (!lessonConfig || !Array.isArray(lessonConfig.hooks)) {
      console.warn('[LessonHookManager] Invalid lesson configuration or missing hooks array');
      return {};
    }

    const hooks = {};
    
    lessonConfig.hooks.forEach(hookConfig => {
      try {
        // Get the hook function from the registry
        const HookFunction = HOOK_MAP[hookConfig.name];
        
        if (!HookFunction) {
          console.warn(`[LessonHookManager] Hook ${hookConfig.name} not found in HOOK_MAP`);
          return;
        }

        // Call the hook - this MUST be at the component's top level
        // The calling component is responsible for React compliance
        const hookInstance = HookFunction();
        
        // Store the hook instance with the configured key
        hooks[hookConfig.key] = hookInstance;
        
        console.log(`[LessonHookManager] Loaded hook: ${hookConfig.name} as ${hookConfig.key}`);
        
      } catch (error) {
        console.error(`[LessonHookManager] Failed to load hook ${hookConfig.name}:`, error);
      }
    });
    
    return hooks;
  }

  /**
   * Get reset methods for all loaded hooks
   * This creates a centralized reset interface for hook state management
   * 
   * @param {Object} hooks - Object containing hook instances
   * @returns {Object} Object with reset methods
   */
  static getResetMethods(hooks) {
    const resetMethods = {};

    // Individual reset methods for each hook
    Object.entries(hooks).forEach(([hookKey, hookInstance]) => {
      // Try to find the reset method for this hook
      const resetMethodName = LessonHookManager.findResetMethod(hookInstance);
      
      if (resetMethodName && typeof hookInstance[resetMethodName] === 'function') {
        resetMethods[`reset${hookKey.charAt(0).toUpperCase() + hookKey.slice(1)}`] = 
          hookInstance[resetMethodName];
      }
    });

    // Universal reset method that calls all individual resets
    resetMethods.resetAllStates = () => {
      Object.values(hooks).forEach(hookInstance => {
        const resetMethodName = LessonHookManager.findResetMethod(hookInstance);
        if (resetMethodName && typeof hookInstance[resetMethodName] === 'function') {
          hookInstance[resetMethodName]();
        }
      });
    };

    return resetMethods;
  }

  /**
   * Find the reset method for a hook instance
   * Different hooks may have different naming conventions
   */
  static findResetMethod(hookInstance) {
    // Common reset method names to try
    const resetMethodNames = [
      'resetPerimeterState',
      'resetMeasurementState', 
      'resetShapeDesignState',
      'reset',
      'resetState',
      'clear',
      'clearState'
    ];

    for (const methodName of resetMethodNames) {
      if (typeof hookInstance[methodName] === 'function') {
        return methodName;
      }
    }

    return null;
  }

  /**
   * Validate hook configuration
   * @param {Object} lessonConfig - Lesson configuration to validate
   * @returns {Object} Validation result
   */
  static validateHookConfiguration(lessonConfig) {
    const errors = [];
    const warnings = [];

    if (!lessonConfig) {
      errors.push('Lesson configuration is required');
      return { isValid: false, errors, warnings };
    }

    if (!Array.isArray(lessonConfig.hooks)) {
      errors.push('Lesson configuration must have hooks array');
      return { isValid: false, errors, warnings };
    }

    lessonConfig.hooks.forEach((hookConfig, index) => {
      if (!hookConfig.name) {
        errors.push(`Hook configuration at index ${index} missing name`);
      } else if (!HOOK_MAP[hookConfig.name]) {
        warnings.push(`Hook ${hookConfig.name} not found in HOOK_MAP - may need to be registered`);
      }

      if (!hookConfig.key) {
        errors.push(`Hook configuration at index ${index} missing key`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get available hooks in the registry
   * Useful for debugging and development
   */
  static getAvailableHooks() {
    return Object.keys(HOOK_MAP);
  }

  /**
   * Register a new hook in the registry
   * This allows for dynamic hook registration if needed
   * 
   * @param {string} name - Hook name
   * @param {Function} hookFunction - The hook function
   */
  static registerHook(name, hookFunction) {
    if (typeof hookFunction !== 'function') {
      throw new Error(`[LessonHookManager] Hook ${name} must be a function`);
    }

    HOOK_MAP[name] = hookFunction;
    console.log(`[LessonHookManager] Registered new hook: ${name}`);
  }

  /**
   * Check if a hook is registered
   * @param {string} hookName - Name of the hook to check
   * @returns {boolean} Whether the hook is registered
   */
  static isHookRegistered(hookName) {
    return hookName in HOOK_MAP;
  }

  /**
   * Get hook statistics for debugging
   */
  static getHookStats() {
    return {
      totalHooks: Object.keys(HOOK_MAP).length,
      availableHooks: Object.keys(HOOK_MAP)
    };
  }
}

// Export the static methods for direct use
export const {
  loadHooksForLesson,
  getResetMethods,
  validateHookConfiguration,
  getAvailableHooks,
  registerHook,
  isHookRegistered,
  getHookStats
} = LessonHookManager;