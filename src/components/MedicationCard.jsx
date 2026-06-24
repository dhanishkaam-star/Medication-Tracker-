import React from 'react';
import { Pill, Clock, ShieldCheck, Tag } from 'lucide-react';

export default function MedicationCard({ medication, onLog }) {
  return (
    <div className="med-card">
      <div className="med-card-top">
        <div className="med-card-icon">
          <Pill size={18} />
        </div>
        <div>
          <p className="med-card-name">{medication.name}</p>
          <p className="med-card-dose">{medication.dose}</p>
        </div>
      </div>
      <div className="med-card-row">
        <div className="med-card-pill-info">
          <Clock size={16} />
          <span>{medication.time}</span>
        </div>
        <button className="med-card-log" onClick={() => onLog(medication.id)}>
          {medication.takenToday ? 'Taken' : 'Log Dose'}
        </button>
      </div>
      <div className="med-card-footer">
        <span>{medication.quantity} · {medication.refillDate}</span>
        <span className="cost-saver">
          <Tag size={14} /> {medication.costSaver}
        </span>
      </div>
      <div className="med-card-helper">
        <ShieldCheck size={14} /> {medication.pharmacy}
      </div>
    </div>
  );
}
