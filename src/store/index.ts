import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customersReducer from './slices/customersSlice';
import petsReducer from './slices/petsSlice';
import servicesReducer from './slices/servicesSlice';
import serviceOrdersReducer from './slices/serviceOrdersSlice';
import productsReducer from './slices/productsSlice';
import salesReducer from './slices/salesSlice';
import stockReducer from './slices/stockSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import vaccinationsReducer from './slices/vaccinationsSlice';
import suppliersReducer from './slices/suppliersSlice';
import promotionsReducer from './slices/promotionsSlice';
import remindersReducer from './slices/remindersSlice';
import accountsReducer from './slices/accountsSlice';
import usersReducer from './slices/usersSlice';

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
    appointments: appointmentsReducer,
    vaccinations: vaccinationsReducer,
    suppliers: suppliersReducer,
    promotions: promotionsReducer,
    reminders: remindersReducer,
    accounts: accountsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



