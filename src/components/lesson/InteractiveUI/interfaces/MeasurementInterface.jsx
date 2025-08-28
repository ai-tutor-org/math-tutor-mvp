import React from 'react';
import MeasurementInput from '../../../common/MeasurementInput';

const MeasurementInterface = ({ measurementHook, onCheck, visible }) => {
  if (!visible) return null;

  return (
    <MeasurementInput
      value={measurementHook.measurementInput}
      onInputChange={measurementHook.setMeasurementInput}
      onCheck={onCheck}
      placeholder="Enter length"
      unit="cm"
    />
  );
};

export default MeasurementInterface;