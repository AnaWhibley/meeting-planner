import React, {useEffect} from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {Avatar, createStyles, makeStyles, Theme} from '@material-ui/core';
import {User} from '../../services/userService';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../app/login/selectors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        primary: {
            backgroundColor: theme.palette.primary.main,
        },
    }),
);

const getInitials = (s: string) => {
    const names = s.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

export function Profile() {
    const classes = useStyles();
    const loggedInUser: User | undefined = useSelector(selectLoggedInUser);
    const initials = loggedInUser ? getInitials(loggedInUser?.name) : undefined;

    return (
        <>
            <NavBar/>
            <div>
                <Avatar alt={loggedInUser?.name} className={classes.primary}>{initials}</Avatar>
            </div>
        </>
    );
}