import React from 'react';
import { STRINGS } from '../data/strings';

export const StepBar = ({ currentStep }: { currentStep: number }) => {
  const steps = STRINGS.steps;

  return (
    <div className="flex items-center gap-2 mb-12">
      {steps.map((step, idx) => (
        <div key={step} className="flex-1 flex flex-col gap-3">
          <div 
            className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${
              idx <= currentStep ? 'bg-primary/70' : 'bg-border'
            }`} 
          />
          <span className={`text-xs uppercase tracking-widest transition-colors duration-700 ${
            idx <= currentStep ? 'text-primary/70' : 'text-taupe/60'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

