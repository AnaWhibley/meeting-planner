import { createSlice } from '@reduxjs/toolkit';
import { requesting } from '../uiStateSlice';
import UserService, {LoginResponse, Role} from '../../services/userService';
import { Dispatch } from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface LoginSlice {
    email: string;
    password: string;
    loggedInUser?: User;
    showErrorMessage: boolean;
}

export interface User {
    name: string;
    role?: Role;
    id: string;
}

export const slice = createSlice({
    name: 'login',
    initialState: {
        email: '',
        password: '',
        showErrorMessage: false
    } as LoginSlice,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
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
            state.email = '';
            state.password = '';
        }
    },
});

export const { setEmail, setPassword, showErrorMessage, setUser } = slice.actions;

export const login = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();
    UserService.login(login.email, login.password).subscribe((response: LoginResponse) => {
        if(response.success){
            dispatch(setUser(response.user))
        } else {
            dispatch(showErrorMessage())
        }
    });
};

export default slice.reducer;