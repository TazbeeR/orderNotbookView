import React from 'react';

const CalendarPicker = ({ onSelectDate, onClose }) => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }

    const getDayName = (date) => {
        const options = { weekday: 'short' };
        return date.toLocaleDateString('pl-PL', options); // 'pl-PL' for Polish day names
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    return (
        <div className="calendar-overlay">
            <div className="calendar-modal animate-fadeIn">
                <h3>Wybierz datę dostawy</h3>
                <div className="calendar-grid">
                    {dates.map((date) => (
                        <button
                            key={formatDate(date)}
                            className="calendar-day-tile"
                            onClick={() => onSelectDate(formatDate(date))}
                        >
                            <span className="day-name">{getDayName(date)}</span>
                            <span className="day-date">{date.getDate()}</span>
                            <span className="day-month">{date.toLocaleDateString('pl-PL', { month: 'short' })}</span>
                        </button>
                    ))}
                </div>
                <button className="calendar-close-btn" onClick={onClose}>Anuluj</button>
            </div>
        </div>
    );
};

export default CalendarPicker;

