import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, NavLink } from 'react-router-dom';
import HomeView from './views/HomeView';
import NewOrderView from './views/NewOrderView';
import './App.css';

const App = () => {
    const { selectedCustomer, previousOrders } = useSelector(state => state.orders || { previousOrders: [] });

    return (
        <div className="container">
            <nav className="navbar">
                <div className="logo">Zeszyt zamówień</div>
                <div className="nav-buttons">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Pulpit</NavLink>
                    <NavLink to="/zamowienia" className={({ isActive }) => isActive ? 'active' : ''}>Zamówienia</NavLink>
                </div>
            </nav>

            <main className="main-wrapper">
                <section className="left-content">
                    <Routes>
                        <Route path="/" element={<HomeView />} />
                        <Route path="/nowe-zamowienie" element={<NewOrderView />} />
                    </Routes>
                </section>

                <section className="right-content">
                    <div className="status-panel">
                        <h2>{selectedCustomer ? 'OSTATNIE ZAMÓWIENIA' : 'STATUS ZAMÓWIEŃ'}</h2>
                        <div className="items-list">
                            {selectedCustomer ? (
                                previousOrders.length > 0 ? previousOrders.map(o => (
                                    <div key={o.id} className="mini-card animate-fadeIn">
                                        <span>Zamówienie #{o.id}</span>
                                        <span style={{ color: 'var(--accent)' }}>{o.total}</span>
                                    </div>
                                )) : <p>Brak historii.</p>
                            ) : (
                                <div className="status-item today">
                                    <span className="label">Na dziś</span>
                                    <span className="value">12</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;