import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "tableData",
  initialState: {
    tableData: [],
  },
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
  },
});

export const {
  setTableData,
} = moviesSlice.actions;
export default moviesSlice.reducer;
