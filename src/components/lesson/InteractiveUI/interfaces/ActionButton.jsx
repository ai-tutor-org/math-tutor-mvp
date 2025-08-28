import React from 'react';
import PrimaryButton from '../../../common/PrimaryButton';

const ActionButton = ({ interaction, activeFeedbackInteraction, onClick, visible }) => {
  if (!visible) return null;

  // Determine button text
  const getButtonText = () => {
    const currentInteraction = activeFeedbackInteraction || interaction;
    
    if (currentInteraction?.type === 'welcome') {
      return "Let's Go!";
    }
    
    if (interaction?.transitionType === 'conditional' && interaction?.buttonText) {
      return interaction.buttonText;
    }
    
    return currentInteraction?.nextButtonText || "Continue";
  };

  return (
    <PrimaryButton onClick={onClick}>
      {getButtonText()}
    </PrimaryButton>
  );
};

export default ActionButton;