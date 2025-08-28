import { useMemo } from 'react';
import usePerimeterInput from '../hooks/usePerimeterInput';
import useMeasurementInput from '../hooks/useMeasurementInput';
import useShapeDesignInput from '../hooks/useShapeDesignInput';

/**
 * Custom hook that manages lesson-specific hooks based on configuration
 * 
 * Replaces the complex LessonHookManager with a clean, React-compliant solution
 * that handles both hook mapping and reset functionality.
 * 
 * @param {Object} lessonConfig - Lesson configuration with hooks array
 * @returns {Object} { lessonHooks, resetMethods }
 */
export function useLessonHooks(lessonConfig) {
  // Call all available hooks at top level (React compliant)
  // These MUST be called at the top level, not inside useMemo or any other hook
  const perimeterHookInstance = usePerimeterInput();
  const measurementHookInstance = useMeasurementInput();
  const shapeDesignHookInstance = useShapeDesignInput();
  // Future hooks should be added here at top level:
  // const fractionHookInstance = useFractionInput();
  // const algebraHookInstance = useAlgebraInput();

  // Create hooks object for mapping (no hook calls inside)
  const allHooks = useMemo(() => ({
    usePerimeterInput: perimeterHookInstance,
    useMeasurementInput: measurementHookInstance,
    useShapeDesignInput: shapeDesignHookInstance,
    // Future hooks:
    // useFractionInput: fractionHookInstance,
    // useAlgebraInput: algebraHookInstance,
  }), [perimeterHookInstance, measurementHookInstance, shapeDesignHookInstance]);

  // Map only the hooks this lesson needs based on configuration
  const lessonHooks = useMemo(() => {
    const hooks = {};
    
    if (!lessonConfig?.hooks) {
      console.warn('[useLessonHooks] No hooks configuration found');
      return hooks;
    }

    lessonConfig.hooks.forEach(hookConfig => {
      const hookInstance = allHooks[hookConfig.name];
      
      if (hookInstance) {
        hooks[hookConfig.key] = hookInstance;
      } else {
        console.warn(`[useLessonHooks] Hook ${hookConfig.name} not found in available hooks`);
      }
    });
    
    return hooks;
  }, [lessonConfig, allHooks]);

  const resetMethods = useMemo(() => {
    const resets = {};
    
    // Universal reset method that calls all hook resets
    resets.resetAllStates = () => {
      Object.values(lessonHooks).forEach(hookInstance => {
        // Try standard reset method names
        const resetMethodNames = [
          'resetPerimeterState',
          'resetMeasurementState', 
          'resetShapeDesignState',
          'reset',
          'resetState'
        ];
        
        for (const resetName of resetMethodNames) {
          if (typeof hookInstance[resetName] === 'function') {
            hookInstance[resetName]();
            break;
          }
        }
      });
    };
    
    // Individual reset methods for specific hooks (future enhancement)
    Object.entries(lessonHooks).forEach(([hookKey, hookInstance]) => {
      const resetMethodNames = [
        'resetPerimeterState',
        'resetMeasurementState',
        'resetShapeDesignState',
        'reset'
      ];
      
      for (const resetName of resetMethodNames) {
        if (typeof hookInstance[resetName] === 'function') {
          const capitalizedKey = hookKey.charAt(0).toUpperCase() + hookKey.slice(1);
          resets[`reset${capitalizedKey}`] = hookInstance[resetName];
          break;
        }
      }
    });
    
    return resets;
  }, [lessonHooks]);

  return { 
    lessonHooks, 
    resetMethods 
  };
}

// Export hook registry for documentation/debugging
export const AVAILABLE_HOOKS = [
  'usePerimeterInput',
  'useMeasurementInput', 
  'useShapeDesignInput'
];

export default useLessonHooks;