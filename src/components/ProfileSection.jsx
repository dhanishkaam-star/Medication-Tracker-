import React from 'react';

export default function ProfileSection({ title, children }) {
  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}
