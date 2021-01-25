import { createSlice } from '@reduxjs/toolkit';
import { requesting } from '../../app/uiStateSlice';
import UserService, {LoginResponse} from "../../services/userService";
import { Dispatch } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'login',
    initialState: {
        username: '',
        password: '',
        loggedInUser: null,
        showErrorMessage: false
    },
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

export const login = () => (dispatch: Dispatch<any>, getState: any) => {
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

export const selectUsername = (state: any) => state.login.username;
export const selectPassword = (state: any) => state.login.password;
export const selectLoggedInUser = (state: any) => state.login.loggedInUser;
export const selectShowErrorMessage = (state: any) => state.login.showErrorMessage;

export default slice.reducer;