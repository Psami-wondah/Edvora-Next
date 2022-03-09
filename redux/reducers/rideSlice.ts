import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface State {
  rides: [];
  user: object;
  isLoading: boolean;
  states: [];
  cities: [];
}

const initialState: State = {
  rides: [],
  user: {},
  isLoading: false,
  states: [],
  cities: [],
};

export const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRides: (state, action) => {
      state.rides = action.payload as [];
    },
    setUser: (state, action) => {
      state.user = action.payload as object;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload as boolean;
    },
    setStates: (state, action) => {
      state.states = action.payload as [];
    },
    setCities: (state, action) => {
      state.cities = action.payload as [];
    },
  },
});

export const { setRides, setUser, setIsLoading, setCities, setStates } = rideSlice.actions;

export const rideReducer = rideSlice.reducer;
