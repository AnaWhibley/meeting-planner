import React from 'react';
import {Avatar, createStyles, makeStyles, Theme} from '@material-ui/core';
import cn from 'classnames';
import {LightenDarkenColor} from '../../styles/theme';

const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

export function AvatarInitials(props: {text: string, color?: string}) {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                display: 'flex',
                '& > *': {
                    margin: theme.spacing(1),
                },
            },
            defaultColor: {
                backgroundColor: '#F8F7FF',
                color: theme.palette.primary.main
            },
            customColor: {
                backgroundColor: props.color && LightenDarkenColor(props.color, 40),
                color:  props.color && LightenDarkenColor(props.color, -40)
            },
        }),
    );

    const classes = useStyles();
    const initials = getInitials(props.text);

    return (
        <>
            <Avatar alt={props.text} className={cn(props.color ? classes.customColor : classes.defaultColor)}>{initials}</Avatar>
        </>
    );
}