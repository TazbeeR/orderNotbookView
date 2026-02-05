import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
    'orders/fetchCustomers',
    async () => {
        const response = await fetch('https://twoja-strona.pl/customer/list');
        return await response.json();
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        customers: [],
        selectedCustomer: null,
        previousOrders: [], // This would ideally come from another API call based on customer ID
        status: 'idle'
    },
    reducers: {
        selectCustomer: (state, action) => {
            state.selectedCustomer = action.payload;
            // Mock data for previous orders sorted by date
            state.previousOrders = [
                { id: 102, date: '2026-01-30', total: '250.00 PLN' },
                { id: 85, date: '2026-01-15', total: '120.00 PLN' }
            ].sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        resetOrderForm: (state) => {
            state.selectedCustomer = null;
            state.previousOrders = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCustomers.fulfilled, (state, action) => {
            state.customers = action.payload;
        });
    }
});

// Zostawiam oryginalny viewSlice dla kompatybilności z Twoim kodem
const viewSlice = createSlice({
    name: 'view',
    initialState: { current: 'home' },
    reducers: { setView: (state, action) => { state.current = action.payload; } }
});

export const { selectCustomer, resetOrderForm } = ordersSlice.actions;
export const { setView } = viewSlice.actions;

export const store = configureStore({
    reducer: {
        view: viewSlice.reducer,
        orders: ordersSlice.reducer
    }
});