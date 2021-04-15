import {RootState} from '../store';

export const selectEmail = (state: RootState) => state.login.email;
export const selectPassword = (state: RootState) => state.login.password;
export const selectLoggedInUser = (state: RootState) => state.login.loggedInUser;
export const selectErrorMessage = (state: RootState) => state.login.errorMessage;
export const selectNameErrorMessage = (state: RootState) => state.login.nameErrorMessage;