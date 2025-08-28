/**
 * BaseCoordinator - Foundation class for all lesson coordinators
 * 
 * This class provides the common functionality that all lesson types need,
 * while allowing specific lessons to override methods for custom behavior.
 * 
 * Design principles:
 * - Configuration-driven behavior
 * - Extensible through inheritance
 * - Maintains same interface as original LessonCoordinator
 * - Error handling and graceful degradation
 */

export class BaseCoordinator {
  constructor(lessonId, config) {
    this.lessonId = lessonId;
    this.config = config || {};
    this.context = null;
    this.handlers = this.buildHandlers();
  }

  /**
   * Build handler mappings from configuration
   */
  buildHandlers() {
    const handlers = {};
    
    // Build handlers from configuration
    Object.keys(this.config.handlers || {}).forEach(handlerName => {
      if (typeof this[handlerName] === 'function') {
        handlers[handlerName] = this[handlerName].bind(this);
      }
    });
    
    return handlers;
  }

  /**
   * Set the context object with all the functions from InteractiveLesson
   * Same interface as original LessonCoordinator
   */
  setContext(context) {
    this.context = context;
  }

  /**
   * Dispatch method to route handler calls with enhanced error handling
   * Same interface as original LessonCoordinator
   */
  dispatch(handlerName, payload) {
    try {
      const handler = this.handlers[handlerName];
      if (handler) {
        return handler(payload);
      }
      
      const warning = `No handler found for ${handlerName} in lesson ${this.lessonId}`;
      console.warn(warning);
      
      // In development, be more vocal about missing handlers
      if (process.env.NODE_ENV === 'development') {
        console.trace(warning);
        console.log('Available handlers:', Object.keys(this.handlers));
      }
      
      return null;
    } catch (error) {
      console.error(`[BaseCoordinator] Error in ${handlerName}:`, error);
      
      // In development, provide more debugging information
      if (process.env.NODE_ENV === 'development') {
        console.error('[BaseCoordinator] Handler payload:', payload);
        console.error('[BaseCoordinator] Coordinator state:', {
          lessonId: this.lessonId,
          handlersCount: Object.keys(this.handlers).length,
          hasContext: !!this.context
        });
      }
      
      // Don't crash the lesson - return safe fallback
      return null;
    }
  }

  // ===================================================================
  // ANSWER HANDLING - Core functionality for all lessons
  // ===================================================================

  /**
   * Main answer handler - routes to specific validators based on configuration
   * Replaces the complex handleAnswer logic from InteractiveLesson.jsx
   */
  handleAnswer(answerData, interaction, context) {
    try {
      // Get handler method name from configuration
      const handlerMethod = this.config.answerHandlers?.[interaction?.type];
      
      if (handlerMethod && typeof this[handlerMethod] === 'function') {
        return this[handlerMethod](answerData, interaction, context);
      }
      
      // Fallback to default answer handling
      return this.handleDefaultAnswer(answerData, interaction, context);
      
    } catch (error) {
      console.error(`[BaseCoordinator] Error in handleAnswer:`, error);
      
      // Graceful degradation - advance to next interaction
      return { action: 'advance' };
    }
  }

  /**
   * Default answer handler for common interaction types
   */
  handleDefaultAnswer(answerData, interaction, context) {
    // Handle multiple choice questions - common to all lessons
    if (interaction?.type === 'multiple-choice-question' && answerData.feedbackId) {
      const feedbackInteraction = context.getFeedbackInteraction(answerData.feedbackId);
      if (feedbackInteraction) {
        context.setDynamicTutorText(feedbackInteraction.tutorText);
        context.setActiveFeedbackInteraction(feedbackInteraction);

        if (feedbackInteraction.type === 'multiple-choice-question') {
          // For retry questions, don't show next button - let user answer again
          return { action: 'wait' };
        }
      }
      return { action: 'wait-for-tts' };
    }

    // Default: advance to next interaction
    return { action: 'advance' };
  }

  /**
   * Handle multiple choice questions - common implementation
   */
  handleMultipleChoice(answerData, interaction, context) {
    return this.handleDefaultAnswer(answerData, interaction, context);
  }

  // ===================================================================
  // COMPONENT PROPS BUILDING - Configurable prop enhancement
  // ===================================================================

  /**
   * Build component props - replaces hardcoded logic from InteractiveLesson
   * Uses configuration to determine which props to add
   */
  getComponentProps(interaction, baseProps, hooks) {
    try {
      // Start with base props
      let props = { ...baseProps };

      // Add standard hook props that are common
      props = this.addStandardHookProps(props, hooks);

      // Add lesson-specific props based on interaction type
      props = this.enhanceComponentProps(interaction, props, hooks);

      // Add content props (either from special handling or direct spread)
      if (this.needsSpecialPropsHandling(interaction)) {
        props.contentProps = {
          ...interaction.contentProps,
          phaseConfig: interaction.phaseConfig
        };
      } else {
        props = { ...props, ...interaction.contentProps };
      }

      return props;

    } catch (error) {
      console.error(`[BaseCoordinator] Error building component props:`, error);
      // Safe fallback - return base props with content props
      return { ...baseProps, ...interaction.contentProps };
    }
  }

  /**
   * Add standard hook props that many components need
   */
  addStandardHookProps(props, hooks) {
    // Common hook props that many components use
    if (hooks.perimeterHook?.showSideHighlighting !== undefined) {
      props.showSideHighlighting = hooks.perimeterHook.showSideHighlighting;
    }

    if (hooks.shapeDesignHook?.setCurrentPerimeter) {
      props.onPerimeterCalculated = hooks.shapeDesignHook.setCurrentPerimeter;
    }

    return props;
  }

  /**
   * Enhanced component props - override in subclasses for lesson-specific logic
   */
  enhanceComponentProps(interaction, props, hooks) {
    // Base implementation - subclasses can override
    return props;
  }

  /**
   * Check if interaction needs special props handling
   */
  needsSpecialPropsHandling(interaction) {
    const specialTypes = ['shape-sorting-game'];
    return specialTypes.includes(interaction.type);
  }

  // ===================================================================
  // ANIMATION LOGIC - Configuration-driven animation rules
  // ===================================================================

  /**
   * Check if interaction should auto-animate based on configuration
   */
  shouldAutoAnimate(interaction) {
    try {
      const rules = this.config.animationRules || [];
      
      return rules.some(rule => {
        // Check pattern match
        if (rule.pattern.endsWith('*')) {
          const prefix = rule.pattern.slice(0, -1);
          if (!interaction?.type?.startsWith(prefix)) {
            return false;
          }
        } else if (interaction?.type !== rule.pattern) {
          return false;
        }

        // Check additional condition if present
        if (rule.condition) {
          if (rule.condition.startsWith('id:')) {
            const requiredId = rule.condition.slice(3);
            return interaction?.id === requiredId;
          }
        }

        return rule.trigger === 'auto';
      });

    } catch (error) {
      console.error(`[BaseCoordinator] Error in shouldAutoAnimate:`, error);
      return false;
    }
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  /**
   * Get required hooks for this lesson type
   */
  getRequiredHooks() {
    return this.config.hooks?.map(hook => hook.key) || [];
  }

  /**
   * Validate configuration
   */
  validateConfiguration() {
    const errors = [];
    
    if (!this.config.id) {
      errors.push('Configuration missing lesson id');
    }
    
    if (!Array.isArray(this.config.hooks)) {
      errors.push('Configuration missing hooks array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===================================================================
  // PLACEHOLDER METHODS - To be implemented by lesson-specific coordinators
  // ===================================================================

  /**
   * Placeholder methods that lesson-specific coordinators should implement
   * These correspond to the handlers defined in the lesson configuration
   */

  onPerimeterCheck(payload) {
    console.warn(`[${this.constructor.name}] onPerimeterCheck not implemented`);
  }

  onShapeDesignCheck(payload) {
    console.warn(`[${this.constructor.name}] onShapeDesignCheck not implemented`);
  }

  onMeasurementCheck(payload) {
    console.warn(`[${this.constructor.name}] onMeasurementCheck not implemented`);
  }

  onShapeHint(payload) {
    console.warn(`[${this.constructor.name}] onShapeHint not implemented`);
  }

  onShapeAutoHelp(payload) {
    console.warn(`[${this.constructor.name}] onShapeAutoHelp not implemented`);
  }

  onShapeCorrection(payload) {
    console.warn(`[${this.constructor.name}] onShapeCorrection not implemented`);
  }
}