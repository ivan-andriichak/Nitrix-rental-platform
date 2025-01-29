import {configureStore} from "@reduxjs/toolkit";

import {apartmentReducer} from "./slices";


let store = configureStore({
    reducer: {
        apartment: apartmentReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export {store}