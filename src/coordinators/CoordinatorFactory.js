/**
 * CoordinatorFactory - Factory pattern for creating lesson coordinators
 * 
 * This factory creates the appropriate coordinator instance based on lesson ID
 * and provides a clean interface for the InteractiveLesson component.
 * 
 * Benefits:
 * - Centralized coordinator creation logic
 * - Easy to add new lesson types
 * - Maintains consistency across lesson coordinators
 * - Provides fallback for unknown lesson types
 */

import { BaseCoordinator } from './BaseCoordinator.js';
import { PerimeterCoordinator } from './PerimeterCoordinator.js';
import { getLessonConfig, validateLessonConfig } from '../lessons/LessonRegistry.js';

/**
 * Registry of lesson coordinators
 * New lesson types can be added here
 */
const COORDINATOR_REGISTRY = {
  perimeter: PerimeterCoordinator,
  // Future lesson coordinators:
  // fractions: FractionsCoordinator,
  // algebra: AlgebraCoordinator,
  // geometry: GeometryCoordinator
};

/**
 * Create a lesson coordinator for the specified lesson
 * 
 * @param {string} lessonId - The lesson identifier
 * @returns {BaseCoordinator} Appropriate coordinator instance
 */
export function createLessonCoordinator(lessonId) {
  try {
    // Get lesson configuration
    const config = getLessonConfig(lessonId);
    
    // Validate the configuration
    const validation = validateLessonConfig(config);
    if (!validation.isValid) {
      console.error(`[CoordinatorFactory] Invalid configuration for lesson ${lessonId}:`, validation.errors);
      // Fall back to base coordinator with default config
      return createFallbackCoordinator(lessonId);
    }
    
    // Get the coordinator class for this lesson
    const CoordinatorClass = COORDINATOR_REGISTRY[lessonId];
    
    if (CoordinatorClass) {
      return new CoordinatorClass(config);
    } else {
      console.warn(`[CoordinatorFactory] No specific coordinator found for lesson: ${lessonId}. Using BaseCoordinator.`);
      return createFallbackCoordinator(lessonId, config);
    }
    
  } catch (error) {
    console.error(`[CoordinatorFactory] Error creating coordinator for lesson ${lessonId}:`, error);
    return createFallbackCoordinator(lessonId);
  }
}

/**
 * Create a fallback coordinator for unknown or problematic lessons
 * 
 * @param {string} lessonId - The lesson identifier
 * @param {Object} config - Optional lesson configuration
 * @returns {BaseCoordinator} Base coordinator instance
 */
function createFallbackCoordinator(lessonId, config = null) {
  
  // Use provided config or get default config
  const lessonConfig = config || getLessonConfig('default');
  
  return new BaseCoordinator(lessonId, lessonConfig);
}

/**
 * Register a new coordinator for a lesson type
 * This allows for dynamic coordinator registration if needed
 * 
 * @param {string} lessonId - The lesson identifier
 * @param {class} CoordinatorClass - The coordinator class (must extend BaseCoordinator)
 */
export function registerCoordinator(lessonId, CoordinatorClass) {
  // Validate that the coordinator class extends BaseCoordinator
  if (!CoordinatorClass || !CoordinatorClass.prototype instanceof BaseCoordinator) {
    throw new Error(`[CoordinatorFactory] Coordinator for ${lessonId} must extend BaseCoordinator`);
  }
  
  COORDINATOR_REGISTRY[lessonId] = CoordinatorClass;
}

/**
 * Check if a coordinator is registered for a lesson
 * 
 * @param {string} lessonId - The lesson identifier
 * @returns {boolean} Whether a coordinator is registered
 */
export function isCoordinatorRegistered(lessonId) {
  return lessonId in COORDINATOR_REGISTRY;
}

/**
 * Get list of all registered lesson coordinators
 * 
 * @returns {Array<string>} Array of lesson IDs with registered coordinators
 */
export function getRegisteredCoordinators() {
  return Object.keys(COORDINATOR_REGISTRY);
}

/**
 * Get coordinator statistics for debugging
 * 
 * @returns {Object} Statistics about registered coordinators
 */
export function getCoordinatorStats() {
  const stats = {
    totalCoordinators: Object.keys(COORDINATOR_REGISTRY).length,
    registeredLessons: Object.keys(COORDINATOR_REGISTRY),
    coordinatorClasses: {}
  };
  
  // Add class names for debugging
  Object.entries(COORDINATOR_REGISTRY).forEach(([lessonId, CoordinatorClass]) => {
    stats.coordinatorClasses[lessonId] = CoordinatorClass.name;
  });
  
  return stats;
}

/**
 * Validate all registered coordinators
 * Useful for system health checks
 * 
 * @returns {Object} Validation results for all coordinators
 */
export function validateAllCoordinators() {
  const results = {
    valid: [],
    invalid: [],
    errors: []
  };
  
  Object.keys(COORDINATOR_REGISTRY).forEach(lessonId => {
    try {
      const coordinator = createLessonCoordinator(lessonId);
      if (coordinator) {
        results.valid.push(lessonId);
      } else {
        results.invalid.push(lessonId);
        results.errors.push(`Failed to create coordinator for ${lessonId}`);
      }
    } catch (error) {
      results.invalid.push(lessonId);
      results.errors.push(`Error validating ${lessonId}: ${error.message}`);
    }
  });
  
  return results;
}

// Export the main factory function as default
export default createLessonCoordinator;