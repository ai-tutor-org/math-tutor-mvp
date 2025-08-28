import React from 'react';
import { getUIInterface } from '../../../utils/componentRegistry';
import ActionButton from './interfaces/ActionButton';

const InteractiveUI = ({
  interaction,
  activeFeedbackInteraction,
  isSpeaking,
  showNextButton,
  lessonHooks = {},
  handlers = {}
}) => {
  // Base visibility condition - no inputs shown when speaking or showing next button
  const baseCondition = !isSpeaking && !showNextButton;
  
  // Helper function to render UI components based on registry
  const renderUIComponent = (interactionData, visible, isMainInteraction = true) => {
    if (!interactionData?.type || !visible) return null;
    
    const config = getUIInterface(interactionData.type);
    if (!config) return null;
    
    const Component = config.component;
    const props = {
      interaction: interactionData,
      visible,
      disabled: isSpeaking
    };
    
    // Map required hook if specified
    if (config.hookKey && lessonHooks[config.hookKey]) {
      props[config.hookKey] = lessonHooks[config.hookKey];
      // Some components expect simplified prop names (backward compatibility)
      const simplifiedHookName = config.hookKey.replace('Hook', '');
      props[simplifiedHookName] = lessonHooks[config.hookKey];
    }
    
    // Map required handler if specified
    if (config.handlerKey && handlers[config.handlerKey]) {
      const handlerKey = config.handlerKey;
      
      // Map handler to appropriate prop name based on component expectations
      if (handlerKey === 'onAnswer') {
        props.onAnswer = handlers[handlerKey];
      } else if (handlerKey.includes('Check')) {
        props.onCheck = handlers[handlerKey];
      } else {
        props[handlerKey] = handlers[handlerKey];
      }
    }
    
    // Handle special props for multiple choice interfaces
    if (interactionData.type === 'multiple-choice-question') {
      // For main interaction, use interaction's choices
      // For feedback interaction, use activeFeedbackInteraction's choices
      const choices = interactionData.contentProps?.choices || [];
      props.choices = choices;
    }
    
    // Pass through other content props
    if (interactionData.contentProps) {
      Object.assign(props, interactionData.contentProps);
    }
    
    return <Component key={`${interactionData.type}-${isMainInteraction ? 'main' : 'feedback'}`} {...props} />;
  };
  
  return (
    <>
      {/* Main interaction UI - only show when there's no feedback interaction */}
      {renderUIComponent(interaction, baseCondition && !activeFeedbackInteraction, true)}
      
      {/* Feedback interaction UI - only show when there IS a feedback interaction */}
      {activeFeedbackInteraction && renderUIComponent(
        activeFeedbackInteraction, 
        baseCondition,
        false
      )}
      
      {/* Action Button - always handled separately */}
      {showNextButton && (
        <ActionButton
          interaction={interaction}
          activeFeedbackInteraction={activeFeedbackInteraction}
          onClick={handlers.onDoneButton}
          visible={showNextButton}
        />
      )}
    </>
  );
};

export default InteractiveUI;