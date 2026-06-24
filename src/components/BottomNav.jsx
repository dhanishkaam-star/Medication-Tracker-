import React from 'react';
import { Home, Archive, CalendarDays, Activity, User } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shelf', label: 'Shelf', icon: Archive },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'insights', label: 'Insights', icon: Activity },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} className={`bottom-nav-item ${active ? 'active' : ''}`} onClick={() => onChange(tab.id)}>
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
