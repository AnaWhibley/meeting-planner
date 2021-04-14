import {createAction, createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from './store';
import {GroupedEventDto} from '../services/eventService';
import {getUserService, ServiceResponse} from "../services/utils";
import {User} from './login/slice';
import { createEventsCompleted } from './eventCreator/slice';

const populateBusyDates = createAction<ServiceResponse<User>>('planner/populateBusyDates');
const showErrorMessage = createAction<ServiceResponse<User>>('login/showErrorMessage');
const populateEvents = createAction<Array<GroupedEventDto>>('planner/populateEvents');
const deleteGroupedEvent = createAction<boolean>('planner/deleteGroupedEvent');
const deleteEvent = createAction<boolean>('planner/deleteEvent');

interface uiStateSlice {
    isLoading: boolean;
    isCreatingEvents: boolean;
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
    goToDate: string;
    deleteGroupedEventCompleted: boolean;
    deleteEventCompleted: boolean;
}

export enum ViewPlanner {
    EVENTS = 'events',
    BUSY_DATES = 'busyDates'
}

export const slice = createSlice({
    name: 'uiState',
    initialState: {
        isLoading: false,
        isCreatingEvents: false,
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
        expandedGroupedEventsDrawer: [],
        goToDate: '',
        deleteGroupedEventCompleted: false,
        deleteEventCompleted: false
    } as uiStateSlice,
    reducers: {
        requesting: state => {
            state.isLoading = true;
        },
        creatingEvents: state => {
            state.isCreatingEvents = true;
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
        setGoToDate: (state, action) => {
            state.goToDate = action.payload;
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
        deleteGroupedEventCompleted: (state) => {
            state.deleteGroupedEventCompleted = true;
            state.eventsGridSelectedTab = 0;
            state.isLoading = false;
            state.selectedRowInformation = undefined;
        },
        setDeleteGroupedEventCompleted: (state, action) => {
            state.deleteGroupedEventCompleted = action.payload;
        },
        deleteEventCompleted: (state) => {
            state.deleteEventCompleted = true;
            state.selectedRowInformation = undefined;
            state.isLoading = false;
        },
        setDeleteEventCompleted: (state, action) => {
            state.deleteEventCompleted = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(populateBusyDates, (state) => {
                state.isLoading = false;
            })
            .addCase(createEventsCompleted, (state) => {
                state.isCreatingEvents = false;
            })
            .addCase(showErrorMessage, (state) => {
                state.isLoading = false;
            })/*
            .addCase(deleteGroupedEvent, (state) => {
                state.deleteGroupedEventCompleted = false;
            })
            .addCase(deleteEvent, (state) => {
                state.deleteGroupedEventCompleted = false;
            })*/
            .addCase(populateEvents, (state, action) => {
                const availableStatus: Set<string> = new Set();
                action.payload.forEach(ev => ev.events.forEach(e => availableStatus.add(e.status)));
                state.selectedOptionsStatusFilter = Array.from(availableStatus);
                state.availableOptionsStatusFilter = Array.from(availableStatus);

                state.expandedGroupedEventsDrawer = action.payload.map(groupedEvent => groupedEvent.groupName);

                //state.isBusy = false;
            })
            .addDefaultCase((state, action) => {})
    },
});
export const { requesting, setCurrentViewPlanner, setDrawerSelector, toggleShowCalendar, setSelectedOptionsStatusFilter,
    resetStatusFilter, setSelectedRowInformation, setForgotPasswordDialogProperty, showGrid, setEventsGridSelectedTab,
    setExpandedGroupedEvent, setGoToDate, deleteGroupedEventCompleted, deleteEventCompleted, setDeleteEventCompleted,
    setDeleteGroupedEventCompleted, creatingEvents } = slice.actions;

export const selectIsLoading = (state: RootState) => state.uiState.isLoading;
export const selectIsCreatingEvents = (state: RootState) => state.uiState.isCreatingEvents;
export const selectGoToDate = (state: RootState) => state.uiState.goToDate;
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
export const selectDeleteEventCompleted = (state: RootState) => state.uiState.deleteEventCompleted;
export const selectDeleteGroupedEventCompleted = (state: RootState) => state.uiState.deleteGroupedEventCompleted;

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
