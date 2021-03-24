import {createAction, createSlice} from '@reduxjs/toolkit';
import {LoginResponse} from "../services/userService";
import {RootState} from "./store";
const incrementByAmount = createAction<number>('counter/incrementByAmount');
const setUser = createAction<LoginResponse>('login/setUser');
const showErrorMessage = createAction<boolean>('login/showErrorMessage');

export const slice = createSlice({
    name: 'uiState',
    initialState: {
        isBusy: false,
    },
    reducers: {
        requesting: state => {
            state.isBusy = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(incrementByAmount, (state) => {
                state.isBusy = false;
            })
            .addCase(setUser, (state) => {
                state.isBusy = false;
            })
            .addCase(showErrorMessage, (state) => {
                state.isBusy = false;
            })
            .addDefaultCase((state, action) => {})
    },
});
export const { requesting } = slice.actions;

export const selectIsBusy = (state: RootState) => state.uiState.isBusy;

export default slice.reducer;