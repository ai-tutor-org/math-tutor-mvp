export class LessonDebugger {
    constructor(lessonId, coordinator) {
        this.lessonId = lessonId;
        this.coordinator = coordinator;
        this.enabled = process.env.NODE_ENV === 'development' && 
                     window.location.search.includes('debug=true');
        
        if (this.enabled) {
            this.setupDebugPanel();
        }
    }

    setupDebugPanel() {
        // Add debug information to window for browser console access
        window.lessonDebug = {
            coordinator: this.coordinator,
            lessonId: this.lessonId,
            handlers: Object.keys(this.coordinator.handlers),
            
            // Helper methods
            testHandler: (handlerName, payload) => {
                console.log(`[DEBUG] Testing handler: ${handlerName}`);
                return this.coordinator.dispatch(handlerName, payload);
            },
            
            inspectInteraction: (interaction) => {
                console.table({
                    id: interaction?.id,
                    type: interaction?.type,
                    hasContentProps: !!interaction?.contentProps,
                    transitionType: interaction?.transitionType,
                    nextButtonText: interaction?.nextButtonText
                });
            },
            
            getCoordinatorInfo: () => ({
                lessonId: this.coordinator.lessonId,
                handlerCount: Object.keys(this.coordinator.handlers).length,
                handlers: Object.keys(this.coordinator.handlers)
            }),
            
            // Animation debugging
            inspectAnimation: (interaction) => {
                const shouldAnimate = this.coordinator.shouldAutoAnimate(interaction);
                console.log(`[DEBUG] Animation for ${interaction?.type}:`, {
                    shouldAutoAnimate: shouldAnimate,
                    interactionType: interaction?.type,
                    interactionId: interaction?.id
                });
            },
            
            // Context debugging  
            inspectContext: () => {
                const context = this.coordinator.context;
                console.log('[DEBUG] Coordinator Context:', {
                    hasContext: !!context,
                    contextKeys: context ? Object.keys(context) : [],
                    requiredHooks: this.coordinator.getRequiredHooks()
                });
            }
        };
        
        console.log(`[LessonDebugger] 🔧 Debug panel active for lesson: ${this.lessonId}`);
        console.log('📊 Access debug tools via: window.lessonDebug');
        console.log('🎯 Available methods:', Object.keys(window.lessonDebug).filter(key => typeof window.lessonDebug[key] === 'function'));
    }

    logInteractionChange(interaction, previousInteraction) {
        if (!this.enabled) return;
        
        console.group(`[LessonDebugger] 🔄 Interaction Change`);
        console.log('📤 From:', previousInteraction?.id || 'none');
        console.log('📥 To:', interaction?.id || 'none');
        console.log('🏷️ Type:', interaction?.type);
        console.log('⚙️ Has ContentProps:', !!interaction?.contentProps);
        console.log('🔀 Transition Type:', interaction?.transitionType);
        console.log('🎮 Should Auto-Animate:', this.coordinator.shouldAutoAnimate(interaction));
        console.groupEnd();
    }

    logHandlerDispatch(handlerName, payload, result) {
        if (!this.enabled) return;
        
        console.log(`[LessonDebugger] 🎯 Handler ${handlerName} dispatched:`, {
            payload,
            result,
            coordinatorUsed: this.coordinator.lessonId
        });
    }

    logAnimationEvent(event, interaction, details) {
        if (!this.enabled) return;
        
        console.log(`[LessonDebugger] 🎬 Animation ${event}:`, {
            interactionType: interaction?.type,
            interactionId: interaction?.id,
            details
        });
    }

    logError(error, context) {
        if (!this.enabled) return;
        
        console.group(`[LessonDebugger] ❌ Error in Lesson ${this.lessonId}`);
        console.error('Error:', error);
        console.log('Context:', context);
        console.log('Current Coordinator:', this.coordinator);
        console.groupEnd();
    }

    logComponentProps(interaction, props) {
        if (!this.enabled) return;
        
        console.log(`[LessonDebugger] 🧩 Component Props for ${interaction?.type}:`, {
            interactionId: interaction?.id,
            propKeys: Object.keys(props),
            hasKey: !!props.key,
            key: props.key
        });
    }
}