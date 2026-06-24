import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <label className="input-group">
      {label && <span className="input-label">{label}</span>}
      <input className="input-field" {...props} />
    </label>
  );
}
