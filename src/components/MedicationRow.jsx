import React from 'react';
import { ChevronRight, CheckCircle, Circle } from 'lucide-react';

export default function MedicationRow({ item, onToggle }) {
  return (
    <div className="medication-row">
      <button className="medication-checkbox" onClick={() => onToggle(item.id)}>
        {item.takenToday ? <CheckCircle size={20} /> : <Circle size={20} />}
      </button>
      <div className="medication-row-info">
        <p className="medication-row-name">{item.name}</p>
        <p className="medication-row-time">{item.time}</p>
      </div>
      <ChevronRight size={18} className="medication-row-arrow" />
    </div>
  );
}
