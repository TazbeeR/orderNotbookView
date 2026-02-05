import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Routes, Route, NavLink, useNavigate} from 'react-router-dom';
import {selectCustomer} from './store'; //
import './App.css'; //

// --- WIDOK: STRONA GŁÓWNA ---

const baseUrl = process.env.REACT_APP_API_URL;
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

// --- WIDOK: NOWE ZAMÓWIENIE (Updated Workflow) ---
const NewOrderView = () => {
    const dispatch = useDispatch();
    const [customers, setCustomers] = useState([]);
    const [casings, setCasings] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const {selectedCustomer, previousOrders} = useSelector(state => state.orders || {previousOrders: []});


    // Pobranie nazwy klienta na podstawie ID ze stanu Redux
    const currentCustomerName = customers.find(c => c.id.toString() === selectedCustomer?.toString())?.name;

    const productCategories = [
        {id: 'cat1', name: 'wieprzowe', color: '#ef4444'},
        {id: 'cat2', name: 'baranie', color: '#38bdf8'},
        {id: 'cat3', name: 'wołowe', color: '#10b981'},
        {id: 'cat4', name: 'przyprawy', color: '#f59e0b'},
        {id: 'cat5', name: 'dodatki', color: '#8b5cf6'}
    ];

    useEffect(() => {
        fetch(`${baseUrl}/customer/list`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error("Błąd klientów:", err));
    }, []);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat.name);
        if (cat.name === 'wieprzowe') {
            fetch(`${baseUrl}/hogcasing/list`)
                .then(res => res.json())
                .then(data => setCasings(data))
                .catch(err => console.error("Błąd hogcasing:", err));
        }
    };

    return (
        <div className="view-container animate-fadeIn">
            <header className="content-header">
                <h1>NOWE ZAMÓWIENIE</h1>
                {/* Wyświetlanie nazwy klienta pod nagłówkiem [Zgodnie z Twoją prośbą] */}
                {selectedCustomer && (
                    <div className="selected-customer-badge animate-fadeIn">
                        <span className="label-tiny">KLIENT:</span>
                        <span className="accent-text" style={{marginLeft: '8px'}}>{currentCustomerName}</span>
                        <button
                            className="back-link"
                            style={{marginLeft: '15px', color: '#64748b'}}
                            onClick={() => {
                                dispatch(selectCustomer(null)); // Reset w Redux
                                setActiveCategory(null);
                            }}
                        >
                            (zmień)
                        </button>
                    </div>
                )}
            </header>

            {/* KROK 1: Wybór klienta (znika po wyborze) */}
            {!selectedCustomer && (
                <div className="card animate-fadeIn"
                     style={{flexDirection: 'column', alignItems: 'flex-start', padding: '20px'}}>
                    <label className="label-tiny">WYBIERZ KLIENTA</label>
                    <select
                        className="card-button"
                        style={{width: '100%', background: 'var(--bg)', padding: '10px'}}
                        onChange={(e) => dispatch(selectCustomer(e.target.value))}
                        value=""
                    >
                        <option value="">-- Wybierz klienta z listy --</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            )}

            {/* KROK 2: Automatyczne wyświetlenie kategorii (pominiecie przycisku) */}
            {selectedCustomer && (
                <div className="product-selection-container animate-fadeIn" style={{marginTop: '10px'}}>
                    <div className="flex-between mb-15">
                        <h3 className="category-title-text">
                            {activeCategory ? `Kategoria: ${activeCategory}` : "Wybierz kategorię produktów"}
                        </h3>
                        {activeCategory && (
                            <button onClick={() => setActiveCategory(null)} className="back-link">
                                ← Powrót
                            </button>
                        )}
                    </div>

                    {!activeCategory ? (
                        <div className="category-row-grid animate-fadeIn">
                            {productCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    className="category-tile-minimal"
                                    style={{borderBottom: `3px solid ${cat.color}`}}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="order-form-mini animate-fadeIn">
                            {/* Przykład dla wieprzowych - Formularz w jednej linii */}
                            {activeCategory === 'wieprzowe' && (
                                <div className="form-one-line">
                                    <input type="hidden" name="id" value={previousOrders.length + 1}/>
                                    <input type="hidden" name="type" value="hog"/>
                                    <select className="select-mini" name="sort">

                                        {['Hoffa', 'TLeu', 'TLch'].map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    <select className="form-input half-width">
                                        <option>Kaliber</option>
                                        {casings.map(item => <option key={item.id}
                                                                     value={item.id}>{item.caliber}</option>)}
                                    </select>
                                    <select className="select-mini" name="origin1">
                                        {['PL', 'CH', 'EU'].map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="jako-text">jako</span>
                                    <select className="form-input half-width">
                                        <option>Na Kaliber</option>
                                        {casings.map(item => <option key={item.id}
                                                                     value={item.id}>{item.caliber}</option>)}
                                    </select>
                                    <select className="select-mini" name="origin2">
                                        {['PL', 'CH', 'EU'].map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Ilość"
                                        required
                                        className="form-input tiny no-spinner"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="Cena"
                                        required
                                        className="form-input tiny no-spinner"
                                    />
                                    <div className="bottom-row">
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Uwagi do produktu..."
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                        />

                                        <button className="add-plus-btn">+</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- GŁÓWNA STRUKTURA APP ---
const App = () => {
    const {selectedCustomer, previousOrders} = useSelector(state => state.orders || {previousOrders: []});

    return (
        <div className="container">
            <nav className="navbar">
                <div className="logo">ORDER-NB</div>
                <div className="nav-buttons">
                    <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Pulpit</NavLink>
                    <NavLink to="/zamowienia" className={({isActive}) => isActive ? 'active' : ''}>Zamówienia</NavLink>
                </div>
            </nav>

            <main className="main-wrapper">
                <section className="left-content">
                    <Routes>
                        <Route path="/" element={<HomeView/>}/>
                        <Route path="/nowe-zamowienie" element={<NewOrderView/>}/>
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
                                        <span style={{color: 'var(--accent)'}}>{o.total}</span>
                                    </div>
                                )) : <p>Brak historii.</p>
                            ) : (
                                <div className="status-item today"><span className="label">Na dziś</span><span
                                    className="value">12</span></div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App; // Naprawia ERROR in ./src/index.js