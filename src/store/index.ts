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
import crmReducer from './slices/crmSlice';
import reviewsReducer from './slices/reviewsSlice';
import groomingPhotosReducer from './slices/groomingPhotosSlice';
import loyaltyReducer from './slices/loyaltySlice';
import cartReducer from './slices/cartSlice';
import paymentsReducer from './slices/paymentsSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import purchasesReducer from './slices/purchasesSlice';
import inventoryReducer from './slices/inventorySlice';
import commissionsReducer from './slices/commissionsSlice';
import hotelReducer from './slices/hotelSlice';

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
    crm: crmReducer,
    reviews: reviewsReducer,
    groomingPhotos: groomingPhotosReducer,
    loyalty: loyaltyReducer,
    cart: cartReducer,
    payments: paymentsReducer,
    subscriptions: subscriptionsReducer,
    purchases: purchasesReducer,
    inventory: inventoryReducer,
    commissions: commissionsReducer,
    hotel: hotelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



