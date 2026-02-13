import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpices } from '../../store';

const SpiceForm = ({ onAdd, initialData }) => {
    const dispatch = useDispatch();
    const spiceList = useSelector((state) => state.orders.spices);
    const spicesStatus = useSelector((state) => state.orders.spicesStatus);

    const initialFormState = {
        selectedSpiceId: '',
        quantity: '',
        price: '',
        description: '',
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (spicesStatus === 'idle') {
            dispatch(fetchSpices());
        }
    }, [spicesStatus, dispatch]);
    
    useEffect(() => {
        if (initialData) {
            setForm({
                selectedSpiceId: initialData.id,
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
        const selectedSpice = spiceList.find(s => s.id === parseInt(form.selectedSpiceId, 10));
        if (selectedSpice && form.quantity && form.price) {
            onAdd({
                id: selectedSpice.id,
                name: selectedSpice.name,
                quantity: parseFloat(form.quantity),
                price: parseFloat(form.price),
                description: form.description,
                unit: 'kg', 
                category: 'Przyprawy',
                type: 'spice',
            });
            // Reset form
            setForm(initialFormState);
        } else {
            alert('Proszę wybrać przyprawę oraz podać ilość i cenę.');
        }
    };
    
    // We don't want to render the loading state directly in the form,
    // as it would disrupt the layout. The parent component can handle it.
    if (spicesStatus === 'loading') {
        return <p>Ładowanie listy przypraw...</p>;
    }

    return (
        <div className="form-one-line animate-fadeIn">
            <input type="hidden" name="type" value="spice"/>

            <div className="form-grid-spices">
                {/* Select dropdown for spice name, styled like the text input in AdditiveForm */}
                <select
                    name="selectedSpiceId"
                    value={form.selectedSpiceId}
                    onChange={handleChange}
                    className="form-input"
                    style={{flex: 2}}
                    required
                >
                    <option value="" disabled hidden>-- Wybierz przyprawę --</option>
                    {spiceList.map(spice => (
                        <option key={spice.id} value={spice.id}>
                            {spice.name}
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
                        placeholder="Opis/Uwagi do przyprawy..."
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

export default SpiceForm;
