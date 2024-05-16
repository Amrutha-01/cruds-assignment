import { configureStore } from '@reduxjs/toolkit';
import tableDataReducer from "./tableDataSlice"


const store = configureStore({
  reducer: {
    tableInfo:tableDataReducer,
  },
});

export default store;
