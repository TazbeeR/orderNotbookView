import React from 'react';

const SheepCasingForm = ({ casings, previousOrdersCount, onAdd }) => {
    return (
        <div className="form-one-line animate-fadeIn">
            <input type="hidden" name="id" value={previousOrdersCount + 1}/>
            <input type="hidden" name="type" value="sheep"/>

            <select className="select-mini" name="sort">
                {['Akif', 'Bilal', 'Chiny'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>

            <select className="form-input half-width" name="caliber1">
                <option>Kaliber</option>
                {casings.map(item => (
                    <option key={item.id} value={item.id}>{item.caliber}</option>
                ))}
            </select>

            <select className="select-mini" name="origin1">
                {['PL', 'CH'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <span className="jako-text">jako</span>

            <select className="form-input half-width" name="caliber2">
                <option>Na Kaliber</option>
                {casings.map(item => (
                    <option key={item.id} value={item.id}>{item.caliber}</option>
                ))}
            </select>

            <select className="select-mini" name="origin2">
                {['PL', 'CH', 'EU'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <input type="number" name="quantity" min="1" placeholder="Ilość" className="form-input tiny no-spinner" required />
            <input type="number" name="price" step="0.01" min="0.01" placeholder="Cena" className="form-input tiny no-spinner" required />

            <div className="bottom-row">
                <textarea
                    className="form-textarea"
                    placeholder="Uwagi do produktu (baranie)..."
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
                <button className="add-plus-btn" type="button" onClick={onAdd}>+</button>
            </div>
        </div>
    );
};

export default SheepCasingForm;