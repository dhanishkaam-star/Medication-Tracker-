import React from 'react';

export default function ProgressSteps({ step }) {
  return (
    <div className="progress-steps">
      {[1, 2, 3, 4, 5, 6].map((value) => (
        <div key={value} className={`progress-step ${step === value ? 'active' : ''}`}>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
