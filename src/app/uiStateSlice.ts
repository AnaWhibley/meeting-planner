import {createAction, createSlice, Dispatch} from '@reduxjs/toolkit';
import {LoginResponse} from '../services/userService';
import {RootState} from './store';
import {GroupedEventDto} from '../services/eventService';
import {getUserService} from "../services/utils";

const setUser = createAction<LoginResponse>('login/setUser');
const populateEvents = createAction<Array<GroupedEventDto>>('planner/populateEvents');

interface uiStateSlice {
    isBusy: boolean;
    currentViewPlanner: string;
    drawerSelector: boolean;
    showCalendar: boolean;
    calendarView: string;
    selectedOptionsStatusFilter: Array<string>;
    availableOptionsStatusFilter: Array<string>;
    selectedRowInformation?: {eventId: string; groupId: number};
    forgotPasswordDialog: {
        show: boolean;
        inputErrorMessage: string;
        emailSent: boolean;
        emailSentError: boolean;
    };
    eventsGridSelectedTab: number;
    expandedGroupedEventsDrawer: Array<string>;
}

export enum ViewPlanner {
    EVENTS = 'events',
    BUSY_DATES = 'busyDates'
}

export const slice = createSlice({
    name: 'uiState',
    initialState: {
        isBusy: false,
        currentViewPlanner: ViewPlanner.EVENTS,
        drawerSelector: false,
        showCalendar: true,
        calendarView: 'dayGridMonth',
        selectedOptionsStatusFilter: [],
        availableOptionsStatusFilter: [],
        forgotPasswordDialog: {
            show: false,
            inputErrorMessage: '',
            emailSent: false,
            emailSentError: false
        },
        eventsGridSelectedTab: 0,
        expandedGroupedEventsDrawer: []
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
        showGrid: (state) => {
            state.showCalendar = false;
        },
        setSelectedOptionsStatusFilter: (state, action) => {
            const currentIndex = state.selectedOptionsStatusFilter.indexOf(action.payload);
            const newSelectedOptionsStatusFilter = [...state.selectedOptionsStatusFilter];

            if (currentIndex === -1) {
                newSelectedOptionsStatusFilter.push(action.payload);
            } else {
                newSelectedOptionsStatusFilter.splice(currentIndex, 1);
            }

            state.selectedOptionsStatusFilter = newSelectedOptionsStatusFilter;
        },
        resetStatusFilter: (state) => {
            state.selectedOptionsStatusFilter = state.availableOptionsStatusFilter;
        },
        setSelectedRowInformation: (state, action) => {
            state.selectedRowInformation = action.payload;
        },
        setForgotPasswordDialogProperty: (state, action) => {
            state.forgotPasswordDialog = {...state.forgotPasswordDialog, ...action.payload};
        },
        setEventsGridSelectedTab: (state, action) => {
            state.eventsGridSelectedTab = action.payload;
        },
        setExpandedGroupedEvent: (state, action) => {
            const currentIndex = state.expandedGroupedEventsDrawer.indexOf(action.payload);
            const newExpandedGroupedEvents = [...state.expandedGroupedEventsDrawer];

            if (currentIndex === -1) {
                newExpandedGroupedEvents.push(action.payload);
            } else {
                newExpandedGroupedEvents.splice(currentIndex, 1);
            }

            state.expandedGroupedEventsDrawer = newExpandedGroupedEvents;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUser, (state) => {
                state.isBusy = false;
            })
            .addCase(populateEvents, (state, action) => {
                const availableStatus: Set<string> = new Set();
                action.payload.forEach(ev => ev.events.forEach(e => availableStatus.add(e.status)));
                state.selectedOptionsStatusFilter = Array.from(availableStatus);
                state.availableOptionsStatusFilter = Array.from(availableStatus);

                state.expandedGroupedEventsDrawer = action.payload.map(groupedEvent => groupedEvent.groupName);

                state.isBusy = false;
            })
            .addDefaultCase((state, action) => {})
    },
});
export const { requesting, setCurrentViewPlanner, setDrawerSelector, toggleShowCalendar, setSelectedOptionsStatusFilter,
    resetStatusFilter, setSelectedRowInformation, setForgotPasswordDialogProperty, showGrid, setEventsGridSelectedTab,
    setExpandedGroupedEvent } = slice.actions;

export const selectIsBusy = (state: RootState) => state.uiState.isBusy;
export const selectEventsGridSelectedTab = (state: RootState) => state.uiState.eventsGridSelectedTab;
export const selectCurrentViewPlanner = (state: RootState) => state.uiState.currentViewPlanner;
export const selectDrawerSelector = (state: RootState) => state.uiState.drawerSelector;
export const selectShowCalendar = (state: RootState) => state.uiState.showCalendar;
export const selectCalendarView = (state: RootState) => state.uiState.calendarView;
export const selectSelectedOptionsStatusFilter = (state: RootState) => state.uiState.selectedOptionsStatusFilter;
export const selectExpandedGroupedEventsDrawer = (state: RootState) => state.uiState.expandedGroupedEventsDrawer;
export const selectSelectedRowInformation = (state: RootState) => {
    const info = state.uiState.selectedRowInformation;
    const groupedEvents = state.planner.events.slice();
    if(info){
        return groupedEvents[info.groupId].events.find(event => event.id === info.eventId)
    }
};
export const selectForgotPasswordDialogInfo = (state: RootState) => state.uiState.forgotPasswordDialog;

export const toggleDrawerSelectorTransition = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const current = getState().uiState.drawerSelector;
    dispatch(setDrawerSelector(!current));
    setTimeout(() => dispatch(setDrawerSelector(!current)), 275);
}

export const forgotPassword = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    //dispatch(requesting());
    const { login } = getState();

    if (!login.email) {
        dispatch(setForgotPasswordDialogProperty({inputErrorMessage: 'Introduzca un correo electrónico'}));
    } else {
        const re = /.+\@.+\..+/;
        if (re.test(String(login.email).toLowerCase())){
            getUserService().forgotPassword(login.email).subscribe((success: boolean) => {
                if(success) {
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
