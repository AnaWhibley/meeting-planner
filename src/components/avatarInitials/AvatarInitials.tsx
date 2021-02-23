import React from 'react';
import {Avatar, createStyles, makeStyles, Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        primary: {
            backgroundColor: '#F8F7FF',
            color: theme.palette.primary.main
        },
    }),
);

const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

export function AvatarInitials(props: {userName: string}) {
    const classes = useStyles();
    const initials = getInitials(props.userName);

    return (
        <>
            <Avatar alt={props.userName} className={classes.primary}>{initials}</Avatar>
        </>
    );
}