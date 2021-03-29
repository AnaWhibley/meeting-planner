import { createSlice } from '@reduxjs/toolkit';
import { requesting } from '../uiStateSlice';
import {Role} from '../../services/userService';
import { Dispatch } from '@reduxjs/toolkit';
import {RootState} from '../store';
import {getUserService, ServiceResponse} from "../../services/utils";
import {getEvents} from '../planner/slice';

export interface LoginSlice {
    email: string;
    password: string;
    loggedInUser: User;
    errorMessage: {
        show: boolean;
        error: string;
    };
}

export interface User {
    name: string;
    role?: Role;
    id: string;
    color?: string;
}

export const slice = createSlice({
    name: 'login',
    initialState: {
        email: '',
        password: '',
        errorMessage: { show: false, error: '' }
    } as LoginSlice,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        showErrorMessage: (state, action) => {
            state.errorMessage = {
                show: true,
                error: action.payload
            };
        },
        setUser: (state, action) => {
            state.loggedInUser = action.payload;
            state.errorMessage = { show: false, error: '' };
            state.email = '';
            state.password = '';
        },
        editName: (state, action) => {
            if (state.loggedInUser) state.loggedInUser.name = action.payload;
        }
    },
});

export const { setEmail, setPassword, showErrorMessage, setUser, editName } = slice.actions;

export const login = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();
    getUserService().login(login.email, login.password).subscribe((response: ServiceResponse<User>) => {
        if(response.success){
            dispatch(setUser(response.data));
            dispatch(getEvents());
        } else {
            dispatch(showErrorMessage(response.error))
        }
    });
};

export const logout = () => (dispatch: Dispatch<any>) => {
    //dispatch(requesting());
    getUserService().logout().subscribe((success: boolean) => {
        if(success){
            dispatch(setUser(undefined));
        }
    });
};

export const editUserName = (newName: string) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const user = login.loggedInUser;
    if(user){
        getUserService().editUserName(user.id, newName).subscribe((success: boolean) => {
            if(success){
                dispatch(editName(newName))
            }
        });
    }
};

export default slice.reducer;
