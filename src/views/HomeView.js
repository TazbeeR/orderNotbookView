import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeView = () => {
    const navigate = useNavigate();
    const actions = [
        {id: 'add', label: 'Dodaj zamówienie', icon: '➕', color: '#10b981', path: '/nowe-zamowienie'},
        {id: 'view', label: 'Przeglądaj zamówienia', icon: '📂', color: '#6366f1', path: '/zamowienia'},
        {id: 'search', label: 'Szukaj produktu', icon: '🔍', color: '#f59e0b', path: '/panel'}
    ];

    return (
        <div className="view-container">
            <header className="content-header">
                <h1>PULPIT OPERACYJNY</h1>
            </header>
            <div className="items-list">
                {actions.map((action) => (
                    <button key={action.id} className="card-button" onClick={() => navigate(action.path)}>
                        <div className="card-icon" style={{backgroundColor: action.color}}>{action.icon}</div>
                        <div className="card-text">
                            <span className="action-title">{action.label}</span>
                            <span className="action-desc">Kliknij, aby przejść</span>
                        </div>
                        <div className="card-arrow">→</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomeView;