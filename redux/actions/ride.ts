import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";
import { setCities, setIsLoading, setRides, setStates, setUser } from "../reducers/rideSlice";
import { Ride } from "../../types/ride";

export const getRides = createAsyncThunk("get/rides", async ({}, thunkAPI) => {
  try {
    thunkAPI.dispatch(setIsLoading(true));
    const response = await Api.getRides();
    const rides: Array<Ride> = response.data;
    thunkAPI.dispatch(setIsLoading(false));
    thunkAPI.dispatch(setRides(rides));
    const cities = [];
    const states = [];
    rides.forEach((ride) => {
      !cities.includes(ride.city) ? cities.push(ride.city) : "";
      !states.includes(ride.state) ? states.push(ride.state) : "";
    });
    thunkAPI.dispatch(setCities(cities.sort()));
    thunkAPI.dispatch(setStates(states.sort()));
    return {
      status: true,
      message: "Rides Fetched Succesfully",
    };
  } catch (err) {
    thunkAPI.dispatch(setIsLoading(false));
    return {
      status: false,
      message: "Error in Fetching Rides",
    };
  }
});

export const getUser = createAsyncThunk("get/user", async ({}, thunkAPI) => {
  try {
    thunkAPI.dispatch(setIsLoading(true));
    const response = await Api.getUser();
    const rides = response.data;
    thunkAPI.dispatch(setIsLoading(false));
    thunkAPI.dispatch(setUser(rides));
    return {
      status: true,
      message: "User Fetched Succesfully",
    };
  } catch (err) {
    thunkAPI.dispatch(setIsLoading(false));
    return {
      status: false,
      message: "Error in Fetching User",
    };
  }
});
