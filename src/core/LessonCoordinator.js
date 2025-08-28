/**
 * LessonCoordinator - Centralized handler for lesson-specific logic
 * 
 * This class abstracts lesson-specific handler logic from InteractiveLesson.jsx
 * while preserving all existing functionality and behavior exactly as-is.
 */
export class LessonCoordinator {
    constructor(lessonId) {
        this.lessonId = lessonId;
        this.context = null;
        this.handlers = this.getHandlersForLesson(lessonId);
    }

    /**
     * Get lesson-specific handler mappings
     */
    getHandlersForLesson(lessonId) {
        switch (lessonId) {
            case 'perimeter':
                return {
                    onPerimeterCheck: this.handlePerimeterCheck.bind(this),
                    onShapeDesignCheck: this.handleShapeDesignCheck.bind(this),
                    onMeasurementCheck: this.handleMeasurementCheck.bind(this),
                    onShapeHint: this.handleShapeHint.bind(this),
                    onShapeAutoHelp: this.handleShapeAutoHelp.bind(this),
                    onShapeCorrection: this.handleShapeCorrection.bind(this)
                };
            default:
                return {};
        }
    }

    /**
     * Dispatch method to route handler calls with enhanced error handling
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
            console.error(`[LessonCoordinator] Error in ${handlerName}:`, error);
            
            // In development, provide more debugging information
            if (process.env.NODE_ENV === 'development') {
                console.error('[LessonCoordinator] Handler payload:', payload);
                console.error('[LessonCoordinator] Coordinator state:', {
                    lessonId: this.lessonId,
                    handlersCount: Object.keys(this.handlers).length,
                    hasContext: !!this.context
                });
            }
            
            // Don't crash the lesson - return safe fallback
            return null;
        }
    }

    /**
     * Set the context object with all the functions from InteractiveLesson
     */
    setContext(context) {
        this.context = context;
    }

    // ===================================================================
    // HANDLER METHODS - COPIED EXACTLY FROM InteractiveLesson.jsx
    // ===================================================================

    /**
     * Handle perimeter check - EXACT COPY from lines 300-311 with error handling
     * Original logic: perimeterHook.handlePerimeterCheck(7 parameters)
     */
    handlePerimeterCheck({ hook, interaction, context }) {
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
            console.error('[LessonCoordinator] Error in handlePerimeterCheck:', error);
            // Graceful degradation - show continue button so user isn't stuck
            context.setShowNextButton?.(true);
        }
    }

    /**
     * Handle shape design check - EXACT COPY from lines 335-346 with error handling
     * Original logic: shapeDesignHook.handleShapeDesignCheck(7 parameters)
     */
    handleShapeDesignCheck({ hook, interaction, context }) {
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
            console.error('[LessonCoordinator] Error in handleShapeDesignCheck:', error);
            // Graceful degradation - show continue button so user isn't stuck
            context.setShowNextButton?.(true);
        }
    }

    /**
     * Handle measurement check - EXACT COPY from lines 348-355 with error handling
     * Original logic: measurementHook.handleMeasurementCheck(3 parameters)
     */
    handleMeasurementCheck({ hook, interaction, context }) {
        try {
            hook.handleMeasurementCheck(
                interaction?.contentProps?.correctAnswer,
                interaction,
                context.handleAnswer
            );
        } catch (error) {
            console.error('[LessonCoordinator] Error in handleMeasurementCheck:', error);
            // Graceful degradation - show continue button so user isn't stuck
            context.setShowNextButton?.(true);
        }
    }

    /**
     * Handle shape hint - EXACT COPY from lines 314-319 with error handling
     * Original logic: getFeedbackText + setDynamicTutorText
     */
    handleShapeHint({ shapeType, context }) {
        try {
            const hintText = context.getFeedbackText(`${shapeType}-hint`);
            if (hintText) {
                context.setDynamicTutorText(hintText);
            }
        } catch (error) {
            console.error('[LessonCoordinator] Error in handleShapeHint:', error);
            // Fail silently - hint is not critical for lesson progress
        }
    }

    /**
     * Handle shape auto help - EXACT COPY from lines 321-326 with error handling
     * Original logic: getFeedbackText + setDynamicTutorText
     */
    handleShapeAutoHelp({ shapeType, context }) {
        try {
            const autoHelpText = context.getFeedbackText(`${shapeType}-auto-help`);
            if (autoHelpText) {
                context.setDynamicTutorText(autoHelpText);
            }
        } catch (error) {
            console.error('[LessonCoordinator] Error in handleShapeAutoHelp:', error);
            // Fail silently - auto help is not critical for lesson progress
        }
    }

    /**
     * Handle shape correction - EXACT COPY from lines 328-333 with error handling
     * Original logic: getFeedbackText + setDynamicTutorText
     */
    handleShapeCorrection({ shapeType, context }) {
        try {
            const correctionText = context.getFeedbackText(`${shapeType}-correction`);
            if (correctionText) {
                context.setDynamicTutorText(correctionText);
            }
        } catch (error) {
            console.error('[LessonCoordinator] Error in handleShapeCorrection:', error);
            // Fail silently - correction is not critical for lesson progress
        }
    }

    // ===================================================================
    // COMPONENT PROPS LOGIC - TO BE ADDED NEXT
    // ===================================================================

    /**
     * Build component props - EXACT COPY from InteractiveLesson.jsx lines 555-588
     * Original logic: Complex props building with perimeter-specific additions
     */
    getComponentProps(interaction, baseProps, hooks) {
        if (this.lessonId === 'perimeter') {
            // Start with base props (equivalent to lines 555-567)
            let props = {
                ...baseProps,
                // Pass highlighting props for perimeter input interactions
                showSideHighlighting: hooks.perimeterHook?.showSideHighlighting,
                // Pass perimeter callback for shape design components
                onPerimeterCalculated: hooks.shapeDesignHook?.setCurrentPerimeter,
            };

            // Special handling for shape-sorting-game component (lines 570-582)
            if (interaction.type === 'shape-sorting-game') {
                props.contentProps = {
                    ...interaction.contentProps,
                    phaseConfig: interaction.phaseConfig
                };
                
                // Pass intervention callbacks for practice phases - using dispatch
                props.onShapeHint = (shapeType) => this.dispatch('onShapeHint', { shapeType, context: this.context });
                props.onShapeAutoHelp = (shapeType) => this.dispatch('onShapeAutoHelp', { shapeType, context: this.context });
                props.onShapeCorrection = (shapeType) => this.dispatch('onShapeCorrection', { shapeType, context: this.context });
            } else {
                // For other components, spread contentProps directly (lines 584-585)
                props = { ...props, ...interaction.contentProps };
            }

            return props;
        }
        
        return baseProps;
    }

    // ===================================================================
    // ANIMATION LOGIC - TO BE ADDED NEXT
    // ===================================================================

    /**
     * Check if interaction should auto-animate - EXACT COPY from lines 446-448
     * Original logic: Complex boolean expression for auto-animation triggers
     */
    shouldAutoAnimate(interaction) {
        if (this.lessonId === 'perimeter') {
            return interaction?.type.startsWith('footsteps-') ||
                   interaction?.type === 'meter-measurement' ||
                   (interaction?.type === 'shape-sorting-game' && interaction?.id === 'shape-demo-modeling');
        }
        return false;
    }

    // ===================================================================
    // UTILITY METHODS
    // ===================================================================

    /**
     * Get required hooks for this lesson type
     */
    getRequiredHooks() {
        switch (this.lessonId) {
            case 'perimeter':
                return ['perimeterHook', 'measurementHook', 'shapeDesignHook'];
            default:
                return [];
        }
    }
}