import React from 'react';
import MultipleChoiceQuestion from '../../../common/MultipleChoiceQuestion';

const MultipleChoiceInterface = ({ choices, onAnswer, disabled, visible }) => {
  if (!visible) return null;

  return (
    <MultipleChoiceQuestion
      choices={choices}
      onAnswer={onAnswer}
      disabled={disabled}
    />
  );
};

export default MultipleChoiceInterface;