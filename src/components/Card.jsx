import React from 'react';

export default function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-heading">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
