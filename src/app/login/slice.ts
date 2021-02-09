import { createSlice } from '@reduxjs/toolkit';
import { requesting } from '../uiStateSlice';
import UserService, {LoginResponse, User} from '../../services/userService';
import { Dispatch } from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface LoginState {
    username: string;
    password: string;
    loggedInUser?: User;
    showErrorMessage: boolean;
}

export const slice = createSlice({
    name: 'login',
    initialState: {
        username: '',
        password: '',
        showErrorMessage: false
    } as LoginState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        showErrorMessage: (state) => {
            state.showErrorMessage = true;
        },
        setUser: (state, action) => {
            state.loggedInUser = action.payload;
            state.showErrorMessage = false;
        }
    },
});

export const { setUsername, setPassword, showErrorMessage, setUser } = slice.actions;

export const login = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();
    UserService.login(login.username, login.password).subscribe((response: LoginResponse) => {
        if(response.success){
            dispatch(setUser(response.data))
        } else {
            dispatch(showErrorMessage())
        }
    });
};

export default slice.reducer;