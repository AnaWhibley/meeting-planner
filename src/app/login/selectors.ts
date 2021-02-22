import {RootState} from '../store';

export const selectEmail = (state: RootState) => state.login.email;
export const selectPassword = (state: RootState) => state.login.password;
export const selectLoggedInUser = (state: RootState) => state.login.loggedInUser;
export const selectShowErrorMessage = (state: RootState) => state.login.showErrorMessage;