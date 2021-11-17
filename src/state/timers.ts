import { createSlice } from "@reduxjs/toolkit";
type State = {
  time: number;
};
const initialState: State = {
  time: Date.now(),
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setTime: (state, action) => {
      return { time: action.payload };
    },
  },
});

export const { actions, reducer } = timeSlice;
export const { setTime } = actions;
export default reducer;
