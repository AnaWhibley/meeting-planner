import {RootState} from '../store';

export const selectUsername = (state: RootState) => state.login.username;
export const selectPassword = (state: RootState) => state.login.password;
export const selectLoggedInUser = (state: RootState) => state.login.loggedInUser;
export const selectShowErrorMessage = (state: RootState) => state.login.showErrorMessage;