import React from 'react';

const BeefForm = ({ previousOrdersCount, onAdd }) => {
    return (
        <div className="form-one-line animate-fadeIn">
            {/* Pola ukryte - typ ustawiony na beef */}
            <input type="hidden" name="id" value={previousOrdersCount + 1}/>
            <input type="hidden" name="type" value="beef"/>

            <div className="form-grid-spices">
                <input
                    type="text"
                    placeholder="Nazwa produktu wołowego"
                    className="form-input"
                    style={{flex: 2}}
                    name="name"
                />
                <input
                    type="number"
                    placeholder="Ilość"
                    className="form-input tiny no-spinner"
                    name="quantity"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Cena"
                    className="form-input tiny no-spinner"
                    name="price"
                />

                <div className="bottom-row">
                    <textarea
                        name="description"
                        className="form-textarea"
                        placeholder="Opis/Uwagi do wołowiny..."
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                    <button className="add-plus-btn" type="button" onClick={onAdd}>+</button>
                </div>
            </div>
        </div>
    );
};

export default BeefForm;