// components/ui/calendar.js
import React from 'react';

const Calendar = ({ mode, selected, onSelect }) => {
  return (
    <div>
      {/* Placeholder for the Calendar */}
      <div className="p-4 bg-gray-200 rounded shadow">
        <h4 className="text-lg">Calendar Placeholder</h4>
        <button onClick={() => onSelect(new Date())}>Select Today</button>
      </div>
    </div>
  );
};

export default Calendar;
