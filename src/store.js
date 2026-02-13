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

// Async thunk for fetching spices
export const fetchSpices = createAsyncThunk(
    'orders/fetchSpices',
    async () => {
        const response = await fetch(`${baseURL}/spices/list`);
        if (!response.ok) {
            throw new Error('Could not fetch spices list!');
        }
        return await response.json();
    }
);

// Async thunk for fetching additives
export const fetchAdditives = createAsyncThunk(
    'orders/fetchAdditives',
    async () => {
        const response = await fetch(`${baseURL}/additive/list`);
        if (!response.ok) {
            throw new Error('Could not fetch additives list!');
        }
        return await response.json();
    }
);

// Async thunk for fetching beef casings
export const fetchBeefCasings = createAsyncThunk(
    'orders/fetchBeefCasings',
    async () => {
        const response = await fetch(`${baseURL}/beefcasing/list`);
        if (!response.ok) {
            throw new Error('Could not fetch beef casings list!');
        }
        return await response.json();
    }
);

// Async thunk for sending an order
export const sendOrder = createAsyncThunk(
    'orders/sendOrder',
    async (finalOrder, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseURL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalOrder),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            return await response.json(); // Or just return success status
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        customers: [],
        selectedCustomer: null,
        previousOrders: [], // This would ideally come from another API call based on customer ID
        status: 'idle', // Status for fetching customers
        spices: [],
        spicesStatus: 'idle',
        additives: [],
        additivesStatus: 'idle',
        beefCasings: [],
        beefCasingsStatus: 'idle',
        orderSubmissionStatus: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
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
                // Sort by name alphabetically
                state.customers = [...action.payload].sort((a, b) => a.name.localeCompare(b.name));
            })
            .addCase(fetchCustomers.rejected, (state) => {
                state.status = 'failed';
            })
            // Extra reducers for fetchSpices
            .addCase(fetchSpices.pending, (state) => {
                state.spicesStatus = 'loading';
            })
            .addCase(fetchSpices.fulfilled, (state, action) => {
                state.spicesStatus = 'succeeded';
                // Sort by name alphabetically
                state.spices = [...action.payload].sort((a, b) => a.name.localeCompare(b.name));
            })
            .addCase(fetchSpices.rejected, (state) => {
                state.spicesStatus = 'failed';
            })
            // Extra reducers for fetchAdditives
            .addCase(fetchAdditives.pending, (state) => {
                state.additivesStatus = 'loading';
            })
            .addCase(fetchAdditives.fulfilled, (state, action) => {
                state.additivesStatus = 'succeeded';
                // Sort by value alphabetically
                state.additives = [...action.payload].sort((a, b) => a.value.localeCompare(b.value));
            })
            .addCase(fetchAdditives.rejected, (state) => {
                state.additivesStatus = 'failed';
            })
            // Extra reducers for fetchBeefCasings
            .addCase(fetchBeefCasings.pending, (state) => {
                state.beefCasingsStatus = 'loading';
            })
            .addCase(fetchBeefCasings.fulfilled, (state, action) => {
                state.beefCasingsStatus = 'succeeded';
                // Sort by value alphabetically
                state.beefCasings = [...action.payload].sort((a, b) => a.value.localeCompare(b.value));
            })
            .addCase(fetchBeefCasings.rejected, (state) => {
                state.beefCasingsStatus = 'failed';
            })
            // Extra reducers for sendOrder
            .addCase(sendOrder.pending, (state) => {
                state.orderSubmissionStatus = 'pending';
            })
            .addCase(sendOrder.fulfilled, (state, action) => {
                state.orderSubmissionStatus = 'succeeded';
                // Optionally add the submitted order to a 'previousOrders' list or similar
                // state.previousOrders.push(action.payload);
                state.currentOrder = { items: [] }; // Clear current order on success
                state.selectedCustomer = null; // Also clear selected customer
                state.previousOrders = []; // Clear previous orders mock data
            })
            .addCase(sendOrder.rejected, (state, action) => {
                state.orderSubmissionStatus = 'failed';
                // You can store the error message here: state.error = action.payload;
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