import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customersReducer from './slices/customersSlice';
import petsReducer from './slices/petsSlice';
import servicesReducer from './slices/servicesSlice';
import serviceOrdersReducer from './slices/serviceOrdersSlice';
import productsReducer from './slices/productsSlice';
import salesReducer from './slices/salesSlice';
import stockReducer from './slices/stockSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    pets: petsReducer,
    services: servicesReducer,
    serviceOrders: serviceOrdersReducer,
    products: productsReducer,
    sales: salesReducer,
    stock: stockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



