import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";


const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer, 
});


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);

export default store;
