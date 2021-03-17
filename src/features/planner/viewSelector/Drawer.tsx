import {useDispatch, useSelector} from 'react-redux';
import {selectDrawerSelector, selectShowCalendar, toggleDrawerSelectorTransition} from '../../../app/uiStateSlice';
import {Drawer as MuiDrawer, IconButton} from '@material-ui/core';
import cn from 'classnames';
import {ReactComponent as ChevronRightIcon} from '../../../assets/icons/evericons/chevron-right.svg';
import {ReactComponent as ChevronLeftIcon} from '../../../assets/icons/evericons/chevron-left.svg';
import {Calendar} from '../calendar/Calendar';
import {EventsGrid} from '../eventsGrid/EventsGrid';
import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {DrawerContent} from './DrawerContent';

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%'
        },
        hide: {
            display: 'none',
        },
        openButton: {
            display: 'flex',
            alignItems: 'center'
        },
        chevronRight: {
            background: theme.palette.primary.main,
            fill: 'white',
            borderBottomRightRadius: '10px',
            borderTopRightRadius: '10px',
            padding: '0.5em'
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            padding: theme.spacing(0, 1),
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            flexShrink: 1,
            padding: theme.spacing(3, 3, 2,3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

export default function Drawer() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const drawerSelector = useSelector(selectDrawerSelector);

    const toggleDrawer = () => {
        dispatch(toggleDrawerSelectorTransition())
    };

    const showCalendar = useSelector(selectShowCalendar);

    return (
        <div className={classes.root}>
            <div className={classes.openButton}>
                <IconButton
                    color="primary"
                    onClick={toggleDrawer}
                    edge="start"
                    className={cn( drawerSelector && classes.hide)}
                >
                    <ChevronRightIcon className={classes.chevronRight}/>
                </IconButton>
            </div>
            <MuiDrawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={drawerSelector}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <DrawerContent/>
            </MuiDrawer>
            <main
                className={cn(classes.content, {
                    [classes.contentShift]: drawerSelector,
                })}>
                {showCalendar ? <Calendar/> : <EventsGrid/>}
            </main>
        </div>
    );
}