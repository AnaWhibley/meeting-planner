import {createAction, createSlice} from '@reduxjs/toolkit';
import {LoginResponse} from "../services/userService";
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
            .addCase(incrementByAmount, (state, action) => {
                state.isBusy = false;
            })
            .addCase(setUser, (state, action) => {
                state.isBusy = false;
            })
            .addCase(showErrorMessage, (state, action) => {
                state.isBusy = false;
            })
            .addDefaultCase((state, action) => {})
    },
});
export const { requesting } = slice.actions;

export default slice.reducer;