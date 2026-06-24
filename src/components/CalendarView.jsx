import React from 'react';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ month, year, events }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendar = [];
  let day = 1;

  for (let week = 0; week < 6; week += 1) {
    const weekDays = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      if ((week === 0 && weekday < firstDay) || day > daysInMonth) {
        weekDays.push(null);
      } else {
        weekDays.push(day);
        day += 1;
      }
    }
    calendar.push(weekDays);
  }

  const dateEvents = events.reduce((acc, item) => {
    const dayMatch = parseInt(item.time.replace(/[^0-9]/g, ''), 10);
    if (!Number.isNaN(dayMatch)) {
      acc[dayMatch] = acc[dayMatch] || [];
      acc[dayMatch].push(item.type);
    }
    return acc;
  }, {});

  return (
    <div className="calendar-grid">
      <div className="calendar-weekdays">
        {weekdays.map((dayName) => (
          <span key={dayName}>{dayName}</span>
        ))}
      </div>
      {calendar.map((week, index) => (
        <div key={index} className="calendar-week">
          {week.map((value, index2) => (
            <div key={index2} className={`calendar-day ${value ? '' : 'empty'}`}>
              {value && (
                <>
                  <span>{value}</span>
                  <div className="calendar-dots">
                    {(dateEvents[value] || []).slice(0, 3).map((type) => (
                      <span key={type} className={`calendar-dot ${type.toLowerCase()}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
