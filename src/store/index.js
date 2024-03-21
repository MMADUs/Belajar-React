import { configureStore } from '@reduxjs/toolkit'

import cartSlice from './cartSlice'
import registerSlice from './registerSlice'

import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';

import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistCartConfig = {
    key: 'cart',
    storage
}

const persistRegisterConfig = {
    key: 'register',
    storage: storageSession
}

const persistedCart = persistReducer(persistCartConfig, cartSlice)
const persistedRegister = persistReducer(persistRegisterConfig, registerSlice)

export const store = configureStore({
    reducer: {
        cart: persistedCart,
        register: persistedRegister
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
})

export const persistor = persistStore(store)