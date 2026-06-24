import React from 'react';

export default function SymptomButton({ label, active, onClick }) {
  return (
    <button className={`symptom-button ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{label}</span>
    </button>
  );
}
