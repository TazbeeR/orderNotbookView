import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = process.env.REACT_APP_API_URL;
const generateId = () => Math.random().toString(36).substr(2, 9);
// Async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
    'orders/fetchCustomers',
    async () => {
        const response = await fetch(`${baseURL}/customer/list`);
        return await response.json();
    }
);
const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        customers: [],
        selectedCustomer: null,
        previousOrders: [], // This would ideally come from another API call based on customer ID
        status: 'idle',
        currentOrder:{
            items: [],
        }
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
        addItemToOrder: (state, action) => {
            const newItem = {
                ...action.payload,
                cartId: generateId(),
                addedAt: new Date().toISOString()
            };
            state.currentOrder.items.push(newItem);
        },

        removeItemFromOrder: (state, action) => {
            state.currentOrder.items = state.currentOrder.items.filter(item => item.cartId !== action.payload);
        },

        updateOrderItem: (state, action) => {
            const{ cartId, updateData } = action.payload;
            const index = state.currentOrder.items.findIndex(item => item.cartId === cartId);
            if (index !== -1) {
                state.currentOrder.items[index] = { ...state.currentOrder.items[index], ...updateData };
            }
        },

        loadOrderToEdit: (state, action) => {
            state.currentOrder.items = action.payload;
            state.selectedCustomer = action.payload.customerId;
        },

        resetOrderForm: (state) => {
            state.selectedCustomer = null;
            state.previousOrders = [];
            state.currentOrder = {
                items: [],
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading'; // Ustawiamy status ładowania
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

const viewSlice = createSlice({
    name: 'view',
    initialState: { current: 'home' },
    reducers: { setView: (state, action) => { state.current = action.payload; } }
});

export const {
    selectCustomer,
    resetOrderForm,
    addItemToOrder,
    removeItemFromOrder,
    updateOrderItem,
    loadOrderToEdit,
} = ordersSlice.actions;

export const { setView } = viewSlice.actions;

export const store = configureStore({
    reducer: {
        view: viewSlice.reducer,
        orders: ordersSlice.reducer
    }
});