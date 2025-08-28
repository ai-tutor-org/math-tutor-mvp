import React from 'react';
import PerimeterInputInterface from './interfaces/PerimeterInputInterface';
import ShapeDesignInterface from './interfaces/ShapeDesignInterface';
import MeasurementInterface from './interfaces/MeasurementInterface';
import MultipleChoiceInterface from './interfaces/MultipleChoiceInterface';
import ActionButton from './interfaces/ActionButton';

const InteractiveUI = ({
  interaction,
  activeFeedbackInteraction,
  isSpeaking,
  showNextButton,
  perimeterHook,
  measurementHook,
  shapeDesignHook,
  handlers
}) => {
  // Calculate visibility conditions
  const baseCondition = !isSpeaking && !showNextButton;
  
  const showPerimeterInput = interaction?.type === 'perimeter-input' && baseCondition;
  const showShapeDesign = interaction?.type === 'perimeter-design' && baseCondition;
  const showMeasurement = interaction?.type === 'shape-measurement' && baseCondition;
  
  const showMultipleChoiceFeedback = activeFeedbackInteraction?.type === 'multiple-choice-question' && baseCondition;
  const showMultipleChoiceMain = interaction?.type === 'multiple-choice-question' && !activeFeedbackInteraction && baseCondition;

  return (
    <>
      {/* Perimeter Input Interface */}
      <PerimeterInputInterface
        interaction={interaction}
        perimeterHook={perimeterHook}
        onCheck={handlers.onPerimeterCheck}
        visible={showPerimeterInput}
      />

      {/* Shape Design Interface */}
      <ShapeDesignInterface
        interaction={interaction}
        onCheck={handlers.onShapeDesignCheck}
        visible={showShapeDesign}
      />

      {/* Measurement Interface */}
      <MeasurementInterface
        measurementHook={measurementHook}
        onCheck={handlers.onMeasurementCheck}
        visible={showMeasurement}
      />

      {/* Multiple Choice Interface - Feedback */}
      <MultipleChoiceInterface
        choices={activeFeedbackInteraction?.contentProps?.choices || []}
        onAnswer={handlers.onAnswer}
        disabled={isSpeaking || showNextButton}
        visible={showMultipleChoiceFeedback}
      />

      {/* Multiple Choice Interface - Main */}
      <MultipleChoiceInterface
        choices={interaction?.contentProps?.choices || []}
        onAnswer={handlers.onAnswer}
        disabled={isSpeaking || showNextButton}
        visible={showMultipleChoiceMain}
      />

      {/* Action Button */}
      <ActionButton
        interaction={interaction}
        activeFeedbackInteraction={activeFeedbackInteraction}
        onClick={handlers.onDoneButton}
        visible={showNextButton}
      />
    </>
  );
};

export default InteractiveUI;