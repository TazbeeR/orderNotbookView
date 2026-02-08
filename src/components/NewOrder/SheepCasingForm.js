import React, { useState, useEffect } from 'react';

const SheepCasingForm = ({ sheepCasings, onAdd, initialData }) => {
    // 1. Definicja początkowego stanu formularza
    const initialFormState = {
        sort: 'Akif',
        caliber1: '',
        origin1: 'PL',
        caliber2: '',
        origin2: 'PL',
        quantity: '',
        price: '',
        description: '',
        type: 'sheep'
    };

    const [formData, setFormData] = useState(initialFormState);

    // 2. Obsługa trybu edycji - ładujemy dane, gdy initialData się zmienia
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(initialFormState);
        }
    }, [initialData]);

    // 3. Obsługa zmian w polach
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Obsługa wysyłki/dodawania
    const handleSubmit = () => {
        if (!formData.quantity || !formData.price) {
            alert("Uzupełnij ilość i cenę");
            return;
        }
        onAdd(formData);
        setFormData(initialFormState);
    };

    return (
        <div className="form-one-line animate-fadeIn">
            <input type="hidden" name="type" value="sheep" />

            <select
                className="select-mini"
                name="sort"
                value={formData.sort}
                onChange={handleChange}
            >
                {['Akif', 'Bilal', 'Chiny'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>

            <select
                className="form-input half-width"
                name="caliber1"
                value={formData.caliber1}
                onChange={handleChange}
            >
                <option value="">Kaliber</option>
                {sheepCasings.map(item => (
                    <option key={item.id} value={item.caliber}>{item.caliber}</option>
                ))}
            </select>

            <select
                className="select-mini"
                name="origin1"
                value={formData.origin1}
                onChange={handleChange}
            >
                {['PL', 'CH'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <span className="jako-text">jako</span>

            <select
                className="form-input half-width"
                name="caliber2"
                value={formData.caliber2}
                onChange={handleChange}
            >
                <option value="">Na Kaliber</option>
                {sheepCasings.map(item => (
                    <option key={item.id} value={item.caliber}>{item.caliber}</option>
                ))}
            </select>

            <select
                className="select-mini"
                name="origin2"
                value={formData.origin2}
                onChange={handleChange}
            >
                {['PL', 'CH'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Ilość"
                className="form-input tiny no-spinner"
                required
            />

            <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Cena"
                className="form-input tiny no-spinner"
                required
            />

            <div className="bottom-row">
                <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Uwagi do produktu (baranie)..."
                    value={formData.description}
                    onChange={handleChange}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
                <button
                    className="add-plus-btn"
                    type="button"
                    onClick={handleSubmit}
                    style={{ backgroundColor: initialData ? '#3b82f6' : '' }}
                >
                    {initialData ? 'OK' : '+'}
                </button>
            </div>
        </div>
    );
};

export default SheepCasingForm;