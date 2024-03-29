import { createSlice } from '@reduxjs/toolkit';
import {requesting, setFirstTimeLoggingDialogOpen} from '../uiStateSlice';
import {Role} from '../../services/userService';
import { Dispatch } from '@reduxjs/toolkit';
import {RootState} from '../store';
import {getUserService, ServiceResponse} from "../../services/utils";
import {getEvents} from '../planner/slice';
import {take} from "rxjs/operators";

export interface LoginSlice {
    email: string;
    password: string;
    loggedInUser: User;
    errorMessage: {
        show: boolean;
        error: string;
    };
    nameErrorMessage: string;
    name: string;
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
        errorMessage: { show: false, error: '' },
        nameErrorMessage: '',
        name: ''
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
        setNameError: (state, action) => {
            state.nameErrorMessage = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        editName: (state, action) => {
            if (state.loggedInUser) state.loggedInUser.name = action.payload;
        }
    },
});

export const { setEmail, setPassword, showErrorMessage, setUser, editName, setNameError, setName } = slice.actions;

export const checkUserSession = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    getUserService().userPersistence().subscribe((response) => {
        if(!response.success) {
            dispatch(setUser(undefined));
        }else{
            dispatch(setUser(response.data || getState().login.loggedInUser));
            dispatch(getEvents());
        }
    });
}

export const login = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();
    getUserService().login(login.email, login.password).pipe(take(1)).subscribe((response: ServiceResponse<User>) => {
        if(response.success){
            const re = /.+\@.+\..+/;
            if(re.test(String(response.data.name).toLowerCase())) {
                dispatch(setFirstTimeLoggingDialogOpen(true));
            }
            dispatch(setUser(response.data));
            dispatch(getEvents());
        } else {
            dispatch(showErrorMessage(response.error))
        }
    });
};

export const logout = () => (dispatch: Dispatch<any>) => {
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
        const re = /.+\@.+\..+/;
        if (newName !== '' && !(re.test(String(newName).toLowerCase()))){
            getUserService().editUserName(user.id, newName).subscribe((success: boolean) => {
                if(success){
                    dispatch(editName(newName));
                    dispatch(setFirstTimeLoggingDialogOpen(false));
                    dispatch(setNameError(''));
                }
            });
        }else{
            dispatch(setNameError('El nombre no puede ser tu correo o estar vacío'));
        }
    }
};

export default slice.reducer;
