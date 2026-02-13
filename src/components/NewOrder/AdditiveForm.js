import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdditives } from '../../store'; // Zmiana na fetchAdditives

const AdditiveForm = ({ onAdd, initialData }) => {
    const dispatch = useDispatch();
    // Zmiana selektorów na dane dodatków
    const additiveList = useSelector((state) => state.orders.additives);
    const additivesStatus = useSelector((state) => state.orders.additivesStatus);

    const initialFormState = {
        selectedAdditiveId: '',
        quantity: '',
        price: '',
        description: '',
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (additivesStatus === 'idle') {
            dispatch(fetchAdditives()); // Zmiana na fetchAdditives
        }
    }, [additivesStatus, dispatch]);
    
    useEffect(() => {
        if (initialData) {
            setForm({
                selectedAdditiveId: initialData.id,
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
        const selectedAdditive = additiveList.find(s => s.id === parseInt(form.selectedAdditiveId, 10));
        if (selectedAdditive && form.quantity && form.price) {
            onAdd({
                id: selectedAdditive.id,
                name: selectedAdditive.value, // Zmiana na 'value'
                quantity: parseFloat(form.quantity),
                price: parseFloat(form.price),
                description: form.description,
                unit: 'kg', 
                category: 'Dodatki', // Zmiana kategorii
                type: 'additive',   // Zmiana typu
            });
            // Reset form
            setForm(initialFormState);
        } else {
            alert('Proszę wybrać dodatek oraz podać ilość i cenę.');
        }
    };
    
    if (additivesStatus === 'loading') {
        return <p>Ładowanie listy dodatków...</p>;
    }

    if (additivesStatus === 'failed') {
        return <p className="error-message">Nie udało się załadować listy dodatków. Sprawdź konsolę lub spróbuj ponownie później.</p>;
    }

    return (
        <div className="form-one-line animate-fadeIn">
            <input type="hidden" name="type" value="additive"/>

            <div className="form-grid-spices">
                <select
                    name="selectedAdditiveId"
                    value={form.selectedAdditiveId}
                    onChange={handleChange}
                    className="form-input"
                    style={{flex: 2}}
                    required
                >
                    <option value="" disabled hidden>-- Wybierz dodatek --</option>
                    {additiveList.map(additive => (
                        <option key={additive.id} value={additive.id}>
                            {additive.value}
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
                        placeholder="Opis/Uwagi do dodatku..."
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

export default AdditiveForm;
