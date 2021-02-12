import {RootState} from '../store';

export const selectBusyDates = (state: RootState) => state.planner.busyDates;