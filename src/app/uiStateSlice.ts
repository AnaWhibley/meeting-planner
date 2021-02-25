import {createAction, createSlice, Dispatch} from '@reduxjs/toolkit';
import {LoginResponse} from '../services/userService';
import {RootState} from './store';
const incrementByAmount = createAction<number>('counter/incrementByAmount');
const setUser = createAction<LoginResponse>('login/setUser');
const showErrorMessage = createAction<boolean>('login/showErrorMessage');

export const slice = createSlice({
    name: 'uiState',
    initialState: {
        isBusy: false,
        currentViewPlanner: 'busyDates',
        drawerSelector: false,
        showCalendar: true,
        calendarView: 'timeGridWeek'
    },
    reducers: {
        requesting: state => {
            state.isBusy = true;
        },
        setCurrentViewPlanner: (state, action) => {
            state.currentViewPlanner = action.payload;
        },
        setDrawerSelector: (state, action) => {
            state.drawerSelector = action.payload;
        },
        toggleShowCalendar: (state) => {
            state.showCalendar = !state.showCalendar;
        }
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
export const { requesting, setCurrentViewPlanner, setDrawerSelector, toggleShowCalendar } = slice.actions;

export const selectIsBusy = (state: RootState) => state.uiState.isBusy;
export const selectCurrentViewPlanner = (state: RootState) => state.uiState.currentViewPlanner;
export const selectDrawerSelector = (state: RootState) => state.uiState.drawerSelector;
export const selectShowCalendar = (state: RootState) => state.uiState.showCalendar;
export const selectCalendarView = (state: RootState) => state.uiState.calendarView;

export const toggleDrawerSelectorTransition = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const current = getState().uiState.drawerSelector;
    dispatch(setDrawerSelector(!current));
    setTimeout(() => dispatch(setDrawerSelector(!current)), 275);
}


export default slice.reducer;