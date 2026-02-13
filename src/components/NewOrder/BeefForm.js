import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBeefCasings } from '../../store'; // Zmiana na fetchBeefCasings

const BeefForm = ({ onAdd, initialData }) => {
    const dispatch = useDispatch();
    // Zmiana selektorów na dane dla wołowiny
    const beefCasingList = useSelector((state) => state.orders.beefCasings);
    const beefCasingsStatus = useSelector((state) => state.orders.beefCasingsStatus);

    const initialFormState = {
        selectedBeefCasingId: '',
        quantity: '',
        price: '',
        description: '',
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (beefCasingsStatus === 'idle') {
            dispatch(fetchBeefCasings()); // Zmiana na fetchBeefCasings
        }
    }, [beefCasingsStatus, dispatch]);
    
    useEffect(() => {
        if (initialData) {
            setForm({
                selectedBeefCasingId: initialData.id,
                quantity: initialData.quantity,
                price: initialData.price,
                description: initialData.description || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => {
        const selectedBeefCasing = beefCasingList.find(s => s.id === parseInt(form.selectedBeefCasingId, 10));
        if (selectedBeefCasing && form.quantity && form.price) {
            onAdd({
                id: selectedBeefCasing.id,
                name: selectedBeefCasing.value, // Używamy 'value' jako nazwy, zgodnie z info
                quantity: parseFloat(form.quantity),
                price: parseFloat(form.price),
                description: form.description,
                unit: 'szt', // Przyjmujemy jednostkę dla osłonek wołowych
                category: 'Wołowe', // Zmiana kategorii
                type: 'beef',   // Zmiana typu
            });
            // Reset form
            setForm(initialFormState);
        } else {
            alert('Proszę wybrać osłonkę wołową oraz podać ilość i cenę.');
        }
    };
    
    if (beefCasingsStatus === 'loading') {
        return <p>Ładowanie listy osłonek wołowych...</p>;
    }

    if (beefCasingsStatus === 'failed') {
        return <p className="error-message">Nie udało się załadować listy osłonek wołowych. Sprawdź konsolę lub spróbuj ponownie później.</p>;
    }

    return (
        <div className="form-one-line animate-fadeIn">
            <input type="hidden" name="type" value="beef"/>

            <div className="form-grid-spices">
                <select
                    name="selectedBeefCasingId"
                    value={form.selectedBeefCasingId}
                    onChange={handleChange}
                    className="form-input"
                    style={{flex: 2}}
                    required
                >
                    <option value="" disabled hidden>-- Wybierz osłonkę wołową --</option>
                    {beefCasingList.map(beefCasing => (
                        <option key={beefCasing.id} value={beefCasing.id}>
                            {beefCasing.value} {/* Używamy 'value' */}
                        </option>
                    ))}
                </select>

                <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Ilość"
                    className="form-input tiny no-spinner"
                    required
                />
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Cena"
                    className="form-input tiny no-spinner"
                    required
                />

                <div className="bottom-row">
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Opis/Uwagi do osłonki wołowej..."
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                    <button 
                        className="add-plus-btn" 
                        type="button" 
                        onClick={handleAddClick}
                        style={{ backgroundColor: initialData ? '#3b82f6' : '' }}
                    >
                        {initialData ? 'OK' : '+'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeefForm;
