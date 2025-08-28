/**
 * LessonRegistry - Central configuration system for all lessons
 * 
 * This registry defines lesson behavior through configuration objects
 * instead of hardcoded logic, enabling easy addition of new lessons.
 */

export const lessonConfigs = {
  perimeter: {
    id: 'perimeter',
    
    // Hook configuration - defines which hooks this lesson needs
    hooks: [
      { name: 'usePerimeterInput', key: 'perimeterHook' },
      { name: 'useMeasurementInput', key: 'measurementHook' },
      { name: 'useShapeDesignInput', key: 'shapeDesignHook' }
    ],
    
    // Handler configuration - defines lesson-specific event handlers
    handlers: {
      onPerimeterCheck: { 
        requiredHooks: ['perimeterHook'],
        description: 'Handle perimeter input validation'
      },
      onShapeDesignCheck: { 
        requiredHooks: ['shapeDesignHook'],
        description: 'Handle shape design perimeter validation'
      },
      onMeasurementCheck: { 
        requiredHooks: ['measurementHook'],
        description: 'Handle measurement input validation'
      },
      onShapeHint: { 
        requiredHooks: [],
        description: 'Show shape sorting hint'
      },
      onShapeAutoHelp: { 
        requiredHooks: [],
        description: 'Show shape sorting auto help'
      },
      onShapeCorrection: { 
        requiredHooks: [],
        description: 'Show shape sorting correction'
      }
    },
    
    // Answer handler mapping - defines how different interaction types are handled
    answerHandlers: {
      'shape-measurement': 'handleShapeMeasurement',
      'multiple-choice-question': 'handleMultipleChoice',
      'perimeter-input': 'handlePerimeterInput',
      'perimeter-design': 'handlePerimeterDesign'
    },
    
    // Animation rules - defines when animations should auto-trigger
    animationRules: [
      { pattern: 'footsteps-*', trigger: 'auto', description: 'Auto-trigger footsteps animations' },
      { pattern: 'meter-measurement', trigger: 'auto', description: 'Auto-trigger meter stick animation' },
      { 
        pattern: 'shape-sorting-game', 
        trigger: 'auto',
        condition: 'id:shape-demo-modeling', 
        description: 'Auto-trigger shape demo animation'
      }
    ],
    
    // Component props configuration - defines special props for specific components
    componentProps: {
      'shape-sorting-game': {
        specialHandlers: ['onShapeHint', 'onShapeAutoHelp', 'onShapeCorrection'],
        description: 'Add intervention callbacks for shape sorting game'
      },
      'footsteps-*': {
        specialProps: ['showSideHighlighting'],
        description: 'Add side highlighting for footsteps animations'
      },
      'perimeter-*': {
        specialProps: ['showSideHighlighting', 'onPerimeterCalculated'],
        description: 'Add perimeter-specific props'
      }
    }
  },
  
  // Default configuration for unknown lessons
  default: {
    id: 'default',
    hooks: [],
    handlers: {},
    answerHandlers: {
      'multiple-choice-question': 'handleMultipleChoice'
    },
    animationRules: [],
    componentProps: {}
  }
};

/**
 * Get configuration for a specific lesson
 * @param {string} lessonId - The lesson identifier
 * @returns {Object} Lesson configuration object
 */
export function getLessonConfig(lessonId) {
  const config = lessonConfigs[lessonId];
  
  if (!config) {
    console.warn(`[LessonRegistry] No configuration found for lesson: ${lessonId}. Using default config.`);
    return lessonConfigs.default;
  }
  
  return config;
}

/**
 * Get list of all registered lesson IDs
 * @returns {Array<string>} Array of lesson IDs
 */
export function getRegisteredLessons() {
  return Object.keys(lessonConfigs).filter(id => id !== 'default');
}

/**
 * Validate lesson configuration
 * @param {Object} config - Lesson configuration to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateLessonConfig(config) {
  const errors = [];
  
  if (!config.id) {
    errors.push('Lesson configuration must have an id');
  }
  
  if (!Array.isArray(config.hooks)) {
    errors.push('Lesson configuration must have hooks array');
  }
  
  if (typeof config.handlers !== 'object') {
    errors.push('Lesson configuration must have handlers object');
  }
  
  if (typeof config.answerHandlers !== 'object') {
    errors.push('Lesson configuration must have answerHandlers object');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}