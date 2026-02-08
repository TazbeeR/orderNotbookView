import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers, selectCustomer, addItemToOrder, removeItemFromOrder } from '../store';

import HogCasingForm from '../components/NewOrder/HogCasingForm';
import SpiceForm from '../components/NewOrder/SpiceForm';
import AdditiveForm from '../components/NewOrder/AdditiveForm';
import SheepCasingForm from '../components/NewOrder/SheepCasingForm';
import BeefForm from '../components/NewOrder/BeefForm';

const baseURL = process.env.REACT_APP_API_URL;

const NewOrderView = () => {
    const dispatch = useDispatch();

    // --- STANY ---
    const [hogCasings, setHogCasings] = useState([]);
    const [sheepCasings, setSheepCasings] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isAddingNext, setIsAddingNext] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { customers, status, selectedCustomer, currentOrder } = useSelector(state => state.orders);
    const basket = currentOrder?.items || [];
    const isLoading = status === 'loading';

    // --- LOGIKA ---

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

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
        setHogCasings([]);
        setSheepCasings([]);

        switch (cat.name) {
            case 'wieprzowe':
                fetch(`${baseURL}/hogcasing/list`)
                    .then(res => res.json())
                    .then(data => setHogCasings(data))
                    .catch(err => console.error("Błąd wieprzowe:", err));
                break;
            case 'baranie':
                fetch(`${baseURL}/sheepcasing/list`)
                    .then(res => res.json())
                    .then(data => setSheepCasings(data))
                    .catch(err => console.error("Błąd baranie:", err));
                break;
            default:
                break;
        }
    };

    const handleEdit = (item) => {
        const typeToCategory = {
            'hog': 'wieprzowe',
            'sheep': 'baranie',
            'beef': 'wołowe',
            'spice': 'przyprawy',
            'additive': 'dodatki'
        };

        setActiveCategory(typeToCategory[item.type]);
        setEditingItem(item);
        setIsAddingNext(true);
        dispatch(removeItemFromOrder(item.cartId));
    };

    const onAddItem = (itemData) => {
        // Ta funkcja teraz odbiera gotowy obiekt z formularza (Controlled Component)
        dispatch(addItemToOrder(itemData));
        setActiveCategory(null);
        setIsAddingNext(false);
        setEditingItem(null);
    };

    // --- RENDER ---
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
                            }}
                        >
                            (zmień)
                        </button>
                    </div>
                )}
            </header>

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

            {selectedCustomer && (
                <div className="product-selection-container animate-fadeIn">
                    {basket.length > 0 && (
                        <div className="basket-summary animate-fadeIn" style={{ marginBottom: '20px' }}>
                            <h3 className="category-title-text">PRODUKTY W TYM ZAMÓWIENIU:</h3>
                            <div className="items-list">
                                {basket.map((item) => (
                                    <div key={item.cartId} className="group flex flex-col border-b border-slate-700 py-2 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center justify-between gap-4 w-full">
                                            <div className="flex items-center flex-nowrap whitespace-nowrap overflow-hidden text-sm gap-2">
                                                {(item.type === 'hog' || item.type === 'sheep') ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold text-accent">{item.sort}</span>
                                                        <span className="text-slate-300">{item.caliber1}{item.origin1}</span>
                                                        <span className="text-slate-500 text-xs">→</span>
                                                        <span className="text-slate-300">{item.caliber2}{item.origin2}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-accent">{item.name}</span>
                                                )}

                                                <div className="flex items-center gap-3 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700">
                                                    <span className="text-white font-mono">
                                                        <span className="text-slate-500 text-xs text-uppercase mr-1">QTY:</span>{item.quantity}
                                                    </span>
                                                    <span className="text-emerald-400 font-mono">
                                                        {item.price}<span className="text-[10px] ml-0.5">PLN</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    EDYTUJ
                                                </button>
                                                <button
                                                    onClick={() => dispatch(removeItemFromOrder(item.cartId))}
                                                    className="text-[10px] font-bold bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    USUŃ
                                                </button>
                                            </div>
                                        </div>

                                        {item.description && (
                                            <div className="w-full mt-1 pt-1 border-t border-slate-700/30">
                                                <p className="text-xs text-slate-400 italic leading-tight">
                                                    <span className="mr-1">💬</span>{item.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!isAddingNext && !activeCategory && (
                                <div className="flex-between" style={{ marginTop: '20px', gap: '10px' }}>
                                    <button
                                        className="card-button"
                                        style={{ background: 'var(--card)', flex: 1 }}
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

                    {(basket.length === 0 || isAddingNext || activeCategory) && (
                        <div className="next-item-section animate-fadeIn" style={{
                            borderTop: basket.length > 0 ? '1px dashed #334155' : 'none',
                            paddingTop: basket.length > 0 ? '20px' : '0'
                        }}>
                            <div className="flex-between mb-15">
                                <h3 className="category-title-text">
                                    {activeCategory ? `Kategoria: ${activeCategory}` : "Dodaj produkt do zamówienia"}
                                </h3>
                                {activeCategory && (
                                    <button onClick={() => { setActiveCategory(null); setEditingItem(null); }} className="back-link">← Powrót</button>
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
                                    {activeCategory === 'wieprzowe' && (
                                        <HogCasingForm
                                            hogCasings={hogCasings}
                                            onAdd={onAddItem}
                                            initialData={editingItem}
                                        />
                                    )}
                                    {activeCategory === 'baranie' && (
                                        <SheepCasingForm
                                            sheepCasings={sheepCasings}
                                            onAdd={onAddItem}
                                            initialData={editingItem}
                                        />
                                    )}
                                    {activeCategory === 'wołowe' && (
                                        <BeefForm
                                            onAdd={onAddItem}
                                            initialData={editingItem}
                                        />
                                    )}
                                    {activeCategory === 'przyprawy' && (
                                        <SpiceForm
                                            onAdd={onAddItem}
                                            initialData={editingItem}
                                        />
                                    )}
                                    {activeCategory === 'dodatki' && (
                                        <AdditiveForm
                                            onAdd={onAddItem}
                                            initialData={editingItem}
                                        />
                                    )}
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