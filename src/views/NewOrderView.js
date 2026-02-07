import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers, selectCustomer } from '../store';

// Importy wydzielonych formularzy
import HogCasingForm from '../components/NewOrder/HogCasingForm';
import SpiceForm from '../components/NewOrder/SpiceForm';
import AdditiveForm from '../components/NewOrder/AdditiveForm';
import SheepCasingForm from '../components/NewOrder/SheepCasingForm';
import BeefForm from '../components/NewOrder/BeefForm';

const baseURL = process.env.REACT_APP_API_URL;

const NewOrderView = () => {
    const dispatch = useDispatch();

    // --- STANY ---
    const [casings, setCasings] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [basket, setBasket] = useState([]);
    const [isAddingNext, setIsAddingNext] = useState(false);

    const { customers, status, selectedCustomer } = useSelector(state => state.orders);
    const isLoading = status === 'loading';

    // --- LOGIKA ---

    // Pobranie listy klientów
    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    // Wyciągnięcie nazwy klienta
    const currentCustomerName = (customers || []).find(
        c => c.id.toString() === selectedCustomer?.toString()
    )?.name;

    const productCategories = [
        { id: 'cat1', name: 'wieprzowe', color: '#ef4444' },
        { id: 'cat2', name: 'baranie', color: '#38bdf8' },
        { id: 'cat3', name: 'wołowe', color: '#10b981' },
        { id: 'cat4', name: 'przyprawy', color: '#f59e0b' },
        { id: 'cat5', name: 'dodatki', color: '#8b5cf6' }
    ];

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat.name);
        if (cat.name === 'wieprzowe') {
            fetch(`${baseURL}/hogcasing/list`)
                .then(res => res.json())
                .then(data => setCasings(data))
                .catch(err => console.error("Błąd wieprzowe:", err));
        } else if (cat.name === 'baranie') {
            fetch(`${baseURL}/sheepcasing/list`)
                .then(res => res.json())
                .then(data => setCasings(data))
                .catch(err => console.error("Błąd baranie:", err));
        } else {
            setCasings([]);
        }
    };

    const addItemToOrder = (e) => {
        const container = e.target.closest('.form-one-line');
        if (!container) return;

        const inputs = container.querySelectorAll('input, select, textarea');
        const itemData = {};

        inputs.forEach(input => {
            if (input.name) {
                itemData[input.name] = input.value;
            }
        });

        setBasket([...basket, itemData]);
        setActiveCategory(null);
        setIsAddingNext(false);
        console.log("Koszyk:", [...basket, itemData]);
    };

    // --- RENDEROWANIE ---
    return (
        <div className="view-container animate-fadeIn">
            <header className="content-header">
                <h1>NOWE ZAMÓWIENIE</h1>
                {selectedCustomer && (
                    <div className="selected-customer-badge animate-fadeIn">
                        <span className="label-tiny">KLIENT:</span>
                        <span className="accent-text" style={{ marginLeft: '8px' }}>
                            {currentCustomerName || "Wczytywanie..."}
                        </span>
                        <button
                            className="back-link"
                            style={{ marginLeft: '15px', color: '#64748b' }}
                            onClick={() => {
                                dispatch(selectCustomer(null));
                                setActiveCategory(null);
                                setBasket([]);
                            }}
                        >
                            (zmień)
                        </button>
                    </div>
                )}
            </header>

            {/* KROK 1: Wybór klienta */}
            {!selectedCustomer && (
                <div className="card animate-fadeIn" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                    <label className="label-tiny">WYBIERZ KLIENTA</label>
                    <select
                        className="card-button"
                        style={{ width: '100%', background: 'var(--bg)', padding: '10px' }}
                        onChange={(e) => dispatch(selectCustomer(e.target.value))}
                        value=""
                        disabled={isLoading}
                    >
                        <option value="">{isLoading ? "Wczytywanie listy..." : "-- Wybierz klienta z listy --"}</option>
                        {customers && customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* KROK 2: Obsługa zamówienia */}
            {selectedCustomer && (
                <div className="product-selection-container animate-fadeIn">

                    {/* LISTA DODANYCH PRODUKTÓW */}
                    {basket.length > 0 && (
                        <div className="basket-summary animate-fadeIn" style={{ marginBottom: '20px' }}>
                            <h3 className="category-title-text">PRODUKTY W TYM ZAMÓWIENIU:</h3>
                            <div className="items-list">
                                {basket.map((item, idx) => (
                                    <div key={idx} className="mini-card" style={{ borderLeft: '4px solid var(--accent)' }}>
                                        <div className="flex-between">
                                            <strong>{item.name || `${item.type?.toUpperCase()} - ${item.sort || ''}`}</strong>
                                            <span>{item.quantity} x {item.price} PLN</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!isAddingNext && !activeCategory && (
                                <div className="flex-between" style={{ marginTop: '20px', gap: '10px' }}>
                                    <button
                                        className="card-button"
                                        style={{ background: 'var(--bg-card)', flex: 1 }}
                                        onClick={() => setIsAddingNext(true)}
                                    >➕ DODAJ KOLEJNY</button>
                                    <button
                                        className="card-button"
                                        style={{ background: '#10b981', color: 'white', flex: 1 }}
                                        onClick={() => alert('Zamówienie gotowe do wysłania!')}
                                    >✅ ZAKOŃCZ ZAMÓWIENIE</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* WYBÓR KATEGORII / FORMULARZE */}
                    {(basket.length === 0 || isAddingNext || activeCategory) && (
                        <div className="next-item-section animate-fadeIn" style={{ borderTop: basket.length > 0 ? '1px dashed #ccc' : 'none', paddingTop: basket.length > 0 ? '20px' : '0' }}>
                            <div className="flex-between mb-15">
                                <h3 className="category-title-text">
                                    {activeCategory ? `Kategoria: ${activeCategory}` : "Dodaj produkt do zamówienia"}
                                </h3>
                                {activeCategory && (
                                    <button onClick={() => setActiveCategory(null)} className="back-link">← Powrót</button>
                                )}
                            </div>

                            {!activeCategory ? (
                                <div className="category-row-grid">
                                    {productCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className="category-tile-minimal"
                                            style={{ borderBottom: `3px solid ${cat.color}` }}
                                            onClick={() => handleCategoryClick(cat)}
                                        >{cat.name}</button>
                                    ))}
                                </div>
                            ) : (
                                <div className="order-form-mini">
                                    {activeCategory === 'wieprzowe' && <HogCasingForm casings={casings} previousOrdersCount={basket.length} onAdd={addItemToOrder} />}
                                    {activeCategory === 'baranie' && <SheepCasingForm casings={casings} previousOrdersCount={basket.length} onAdd={addItemToOrder} />}
                                    {activeCategory === 'wołowe' && <BeefForm previousOrdersCount={basket.length} onAdd={addItemToOrder} />}
                                    {activeCategory === 'przyprawy' && <SpiceForm previousOrdersCount={basket.length} onAdd={addItemToOrder} />}
                                    {activeCategory === 'dodatki' && <AdditiveForm previousOrdersCount={basket.length} onAdd={addItemToOrder} />}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewOrderView;