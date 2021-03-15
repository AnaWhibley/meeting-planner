import {createAction, createSlice, Dispatch} from '@reduxjs/toolkit';
import UserService, {LoginResponse} from '../services/userService';
import {RootState} from './store';
import {GroupedEventDto} from '../services/eventService';
const incrementByAmount = createAction<number>('counter/incrementByAmount');
const setUser = createAction<LoginResponse>('login/setUser');
const showErrorMessage = createAction<boolean>('login/showErrorMessage');
const populateEvents = createAction<Array<GroupedEventDto>>('planner/populateEvents');

interface uiStateSlice {
    isBusy: boolean;
    currentViewPlanner: string;
    drawerSelector: boolean;
    showCalendar: boolean;
    calendarView: string;
    selectedOptionsStatusFilter: Array<string>;
    availableOptionsStatusFilter: Array<string>;
    selectedRowInformation?: any;
    forgotPasswordDialog: {
        show: boolean;
        inputErrorMessage: string;
        emailSent: boolean;
        emailSentError: boolean;
    };
}

export const slice = createSlice({
    name: 'uiState',
    initialState: {
        isBusy: false,
        currentViewPlanner: 'busyDates',
        drawerSelector: false,
        showCalendar: true,
        calendarView: 'timeGridWeek',
        selectedOptionsStatusFilter: [],
        availableOptionsStatusFilter: [],
        forgotPasswordDialog: {
            show: false,
            inputErrorMessage: '',
            emailSent: false,
            emailSentError: false
        },
    } as uiStateSlice,
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
        },
        setSelectedOptionsStatusFilter: ((state, action) => {
            const currentIndex = state.selectedOptionsStatusFilter.indexOf(action.payload);
            const newSelectedOptionsStatusFilter = [...state.selectedOptionsStatusFilter];

            if (currentIndex === -1) {
                newSelectedOptionsStatusFilter.push(action.payload);
            } else {
                newSelectedOptionsStatusFilter.splice(currentIndex, 1);
            }

            state.selectedOptionsStatusFilter = newSelectedOptionsStatusFilter;
        }),
        resetStatusFilter: (state) => {
            state.selectedOptionsStatusFilter = state.availableOptionsStatusFilter;
        },
        setSelectedRowInformation: (state, action) => {
            state.selectedRowInformation = action.payload;
        },
        setForgotPasswordDialogProperty: (state, action) => {
            state.forgotPasswordDialog = {...state.forgotPasswordDialog, ...action.payload};
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
            .addCase(populateEvents, (state, action) => {
                const availableStatus: Set<string> = new Set();
                action.payload.forEach(ev => ev.events.forEach(e => availableStatus.add(e.status)));
                state.selectedOptionsStatusFilter = Array.from(availableStatus);
                state.availableOptionsStatusFilter = Array.from(availableStatus);
            })
            .addDefaultCase((state, action) => {})
    },
});
export const { requesting, setCurrentViewPlanner, setDrawerSelector, toggleShowCalendar, setSelectedOptionsStatusFilter,
    resetStatusFilter, setSelectedRowInformation, setForgotPasswordDialogProperty } = slice.actions;

export const selectIsBusy = (state: RootState) => state.uiState.isBusy;
export const selectCurrentViewPlanner = (state: RootState) => state.uiState.currentViewPlanner;
export const selectDrawerSelector = (state: RootState) => state.uiState.drawerSelector;
export const selectShowCalendar = (state: RootState) => state.uiState.showCalendar;
export const selectCalendarView = (state: RootState) => state.uiState.calendarView;
export const selectSelectedOptionsStatusFilter = (state: RootState) => state.uiState.selectedOptionsStatusFilter;
export const selectSelectedRowInformation = (state: RootState) => state.uiState.selectedRowInformation;
export const selectForgotPasswordDialogInfo = (state: RootState) => state.uiState.forgotPasswordDialog;

export const toggleDrawerSelectorTransition = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const current = getState().uiState.drawerSelector;
    dispatch(setDrawerSelector(!current));
    setTimeout(() => dispatch(setDrawerSelector(!current)), 275);
}

export const forgotPassword = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();

    if (!login.email) {
        dispatch(setForgotPasswordDialogProperty({inputErrorMessage: 'Introduzca un correo electrónico'}));
    } else {
        const re = /.+\@.+\..+/;
        if (re.test(String(login.email).toLowerCase())){
            UserService.forgotPassword(login.email).subscribe((response: boolean) => {
                if(response) {
                    dispatch(setForgotPasswordDialogProperty({ show: false, emailSent: true}));
                }else {
                    dispatch(setForgotPasswordDialogProperty({ show: false, emailSentError: true}));
                }
            });
        }else{
            dispatch(setForgotPasswordDialogProperty({inputErrorMessage: 'El correo no tiene un formato válido'}));
        }
    }
};

export default slice.reducer;