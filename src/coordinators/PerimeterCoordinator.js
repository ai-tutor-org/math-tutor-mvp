/**
 * PerimeterCoordinator - Lesson coordinator for perimeter lessons
 * 
 * This class contains ALL the perimeter-specific logic that was previously
 * hardcoded in InteractiveLesson.jsx and LessonCoordinator.js.
 * 
 * It extends BaseCoordinator and implements all the specific handlers
 * and answer processing logic for the perimeter lesson.
 */

import { BaseCoordinator } from './BaseCoordinator.js';

export class PerimeterCoordinator extends BaseCoordinator {
  constructor(config) {
    super('perimeter', config);
  }

  // ===================================================================
  // ANSWER HANDLING - Perimeter-specific answer logic
  // ===================================================================

  /**
   * Handle shape measurement interactions
   * Replaces logic from InteractiveLesson.jsx lines 277-291
   */
  handleShapeMeasurement(answerData, interaction, context) {
    if (answerData.isCorrect) {
      // Show success feedback for all measurements
      const feedbackText = context.getFeedbackText('shape-correct');
      if (feedbackText) {
        context.setDynamicTutorText(feedbackText);
      }
      context.setShowNextButton(true);
    } else {
      const incorrectFeedback = context.getFeedbackText('shape-incorrect');
      if (incorrectFeedback) {
        context.setDynamicTutorText(incorrectFeedback);
      }
    }
    
    return { action: 'handled' };
  }

  /**
   * Handle perimeter input interactions
   * This delegates to the hook's handlePerimeterCheck method
   */
  handlePerimeterInput(answerData, interaction, context) {
    // This is handled by the hook directly via onPerimeterCheck handler
    return { action: 'delegate-to-hook', hook: 'perimeterHook', method: 'handlePerimeterCheck' };
  }

  /**
   * Handle perimeter design interactions
   * This delegates to the hook's handleShapeDesignCheck method
   */
  handlePerimeterDesign(answerData, interaction, context) {
    // This is handled by the hook directly via onShapeDesignCheck handler
    return { action: 'delegate-to-hook', hook: 'shapeDesignHook', method: 'handleShapeDesignCheck' };
  }

  // ===================================================================
  // HOOK-BASED HANDLERS - Direct implementations from LessonCoordinator
  // ===================================================================

  /**
   * Handle perimeter check - EXACT COPY from LessonCoordinator.js lines 86-102
   */
  onPerimeterCheck({ hook, interaction, context }) {
    try {
      hook.handlePerimeterCheck(
        interaction?.contentProps?.correctAnswer,
        interaction?.contentProps?.feedbackIds,
        context.getFeedbackText,
        context.getFeedbackInteraction,
        context.setDynamicTutorText,
        context.setActiveFeedbackInteraction,
        context.setShowNextButton
      );
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onPerimeterCheck:', error);
      // Graceful degradation - show continue button so user isn't stuck
      context.setShowNextButton?.(true);
    }
  }

  /**
   * Handle shape design check - EXACT COPY from LessonCoordinator.js lines 108-124
   */
  onShapeDesignCheck({ hook, interaction, context }) {
    try {
      hook.handleShapeDesignCheck(
        interaction?.contentProps?.targetPerimeter,
        interaction?.contentProps?.feedbackIds,
        context.getFeedbackText,
        context.getFeedbackInteraction,
        context.setDynamicTutorText,
        context.setActiveFeedbackInteraction,
        context.setShowNextButton
      );
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onShapeDesignCheck:', error);
      // Graceful degradation - show continue button so user isn't stuck
      context.setShowNextButton?.(true);
    }
  }

  /**
   * Handle measurement check - EXACT COPY from LessonCoordinator.js lines 130-142
   */
  onMeasurementCheck({ hook, interaction, context }) {
    try {
      hook.handleMeasurementCheck(
        interaction?.contentProps?.correctAnswer,
        interaction,
        context.handleAnswer
      );
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onMeasurementCheck:', error);
      // Graceful degradation - show continue button so user isn't stuck
      context.setShowNextButton?.(true);
    }
  }

  /**
   * Handle shape hint - EXACT COPY from LessonCoordinator.js lines 148-158
   */
  onShapeHint({ shapeType, context }) {
    try {
      const hintText = context.getFeedbackText(`${shapeType}-hint`);
      if (hintText) {
        context.setDynamicTutorText(hintText);
      }
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onShapeHint:', error);
      // Fail silently - hint is not critical for lesson progress
    }
  }

  /**
   * Handle shape auto help - EXACT COPY from LessonCoordinator.js lines 164-174
   */
  onShapeAutoHelp({ shapeType, context }) {
    try {
      const autoHelpText = context.getFeedbackText(`${shapeType}-auto-help`);
      if (autoHelpText) {
        context.setDynamicTutorText(autoHelpText);
      }
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onShapeAutoHelp:', error);
      // Fail silently - auto help is not critical for lesson progress
    }
  }

  /**
   * Handle shape correction - EXACT COPY from LessonCoordinator.js lines 180-190
   */
  onShapeCorrection({ shapeType, context }) {
    try {
      const correctionText = context.getFeedbackText(`${shapeType}-correction`);
      if (correctionText) {
        context.setDynamicTutorText(correctionText);
      }
    } catch (error) {
      console.error('[PerimeterCoordinator] Error in onShapeCorrection:', error);
      // Fail silently - correction is not critical for lesson progress
    }
  }

  // ===================================================================
  // COMPONENT PROPS ENHANCEMENT - Perimeter-specific props
  // ===================================================================

  /**
   * Enhanced component props for perimeter lesson
   * Replaces logic from LessonCoordinator.js lines 200-231
   */
  enhanceComponentProps(interaction, props, hooks) {
    // Special handling for shape-sorting-game component
    if (interaction.type === 'shape-sorting-game') {
      // Add intervention callbacks for practice phases - using dispatch
      props.onShapeHint = (shapeType) => this.dispatch('onShapeHint', { 
        shapeType, 
        context: this.context 
      });
      
      props.onShapeAutoHelp = (shapeType) => this.dispatch('onShapeAutoHelp', { 
        shapeType, 
        context: this.context 
      });
      
      props.onShapeCorrection = (shapeType) => this.dispatch('onShapeCorrection', { 
        shapeType, 
        context: this.context 
      });
      
      return props;
    }
    
    // For footsteps animations, add side highlighting
    if (interaction.type?.startsWith('footsteps-')) {
      props.showSideHighlighting = hooks.perimeterHook?.showSideHighlighting;
      return props;
    }
    
    // For perimeter-related interactions, add perimeter-specific props
    if (interaction.type?.startsWith('perimeter-') || interaction.type === 'footsteps-perimeter') {
      props.showSideHighlighting = hooks.perimeterHook?.showSideHighlighting;
      if (hooks.shapeDesignHook?.setCurrentPerimeter) {
        props.onPerimeterCalculated = hooks.shapeDesignHook.setCurrentPerimeter;
      }
      return props;
    }
    
    // Default: return props as-is
    return props;
  }

  // ===================================================================
  // ANIMATION RULES - Perimeter-specific animation logic
  // ===================================================================

  /**
   * Animation rules are handled by the base class using configuration,
   * but we can override if needed for special cases
   */
  shouldAutoAnimate(interaction) {
    // Use configuration-based rules from base class
    const configResult = super.shouldAutoAnimate(interaction);
    
    // Add any perimeter-specific overrides here if needed
    // For now, the configuration handles all our cases correctly
    
    return configResult;
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  /**
   * Get handlers for coordinator dispatch - used by InteractiveLesson
   * This maintains compatibility with the current system
   */
  getHandlers() {
    return {
      onPerimeterCheck: this.onPerimeterCheck.bind(this),
      onShapeDesignCheck: this.onShapeDesignCheck.bind(this),
      onMeasurementCheck: this.onMeasurementCheck.bind(this),
      onShapeHint: this.onShapeHint.bind(this),
      onShapeAutoHelp: this.onShapeAutoHelp.bind(this),
      onShapeCorrection: this.onShapeCorrection.bind(this)
    };
  }
}