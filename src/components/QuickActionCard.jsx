import React from 'react';

export default function QuickActionCard({ title, subtitle, onClick }) {
  return (
    <button className="quick-card" onClick={onClick}>
      <div className="quick-card-content">
        <span>{title}</span>
        <p>{subtitle}</p>
      </div>
    </button>
  );
}
