import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'classnames';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Drawer,
    FormControlLabel,
    IconButton,
    ListItemIcon,
    Radio,
    RadioGroup,
    Typography
} from '@material-ui/core';
import {ReactComponent as CirclePlusIcon} from '../../../assets/icons/evericons/circle-plus.svg';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {ReactComponent as ChevronLeftIcon} from '../../../assets/icons/evericons/chevron-left.svg';
import {ReactComponent as ChevronRightIcon} from '../../../assets/icons/evericons/chevron-right.svg';
import '../../../styles/common.scss';
import {AvatarInitials} from '../../../components/avatarInitials/AvatarInitials';
import './ViewSelector.scss';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {Calendar} from "../calendar/Calendar";
import {useDispatch, useSelector} from 'react-redux';
import {
    selectCurrentViewPlanner,
    selectDrawerSelector, selectShowCalendar,
    setCurrentViewPlanner, toggleDrawerSelectorTransition,
    toggleShowCalendar
} from '../../../app/uiStateSlice';
import {EventsGrid} from '../eventsGrid/EventsGrid';

export function ViewSelector() {
    return (
        <div className={'ViewSelectorContainer'}>
            <PersistentDrawerLeft/>
        </div>
    );
}

export function CheckboxListSecondary() {

    const dispatch = useDispatch();
    const currentViewPlanner = useSelector(selectCurrentViewPlanner);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setCurrentViewPlanner((event.target as HTMLInputElement).value));
    };

    const [checked, setChecked] = React.useState([1]);
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const showCalendar = useSelector(selectShowCalendar);

    return (
        <>
            {currentViewPlanner === 'busyDates' ?
                <Accordion defaultExpanded className={'Accordion'}>
                    <AccordionSummary
                        expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                    >
                        <Typography variant={'h2'} color={'primary'}>Participantes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense className={''}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem key={value} button>
                                        <ListItemAvatar>
                                            <AvatarInitials userName={`Avatar ${value + 1}`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={`Line item ${value + 1}`}/>
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                color="primary"
                                                onChange={handleToggle(value)}
                                                checked={checked.indexOf(value) !== -1}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
                :
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                    >
                        <Typography variant={'h2'} color={'primary'}>Defensas</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 ].map((value) => {
                                const labelId = `checkbox-list-label-${value}`;

                                return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(value) !== -1}
                                                tabIndex={-1}
                                                color={'primary'}
                                                disableRipple
                                                inputProps={{'aria-labelledby': labelId}}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={`Line item ${value + 1}`}/>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end">
                                                <InfoIcon className={'FillPrimary'}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
            }
            <Accordion>
                <AccordionSummary
                    expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                >
                    <Typography variant={'h2'} color={'primary'}>Vista</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RadioGroup name="view" value={currentViewPlanner} onChange={handleChange} className={'ViewRadioGroup'}>
                        <FormControlLabel value="busyDates" control={<Radio color="primary"/>}
                                          label="Mostrar indisponibilidades de participantes"/>
                        <FormControlLabel value="events" control={<Radio color="primary"/>} label="Mostrar defensas"/>
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>
            <ActionButton color={Color.PRIMARY} variant={ButtonVariant.OUTLINED} innerText={showCalendar ? 'Ver detalles de defensas' : 'Ver calendario'}
                          onClick={() => dispatch(toggleShowCalendar())} className={'EventsDetailsButton'}/>
        </>
    );
}

const drawerWidth = 250;

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

export function PersistentDrawerLeft() {
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
                    className={clsx( drawerSelector && classes.hide)}
                >
                    <ChevronRightIcon className={classes.chevronRight}/>
                </IconButton>
            </div>
            <Drawer
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
                <CheckboxListSecondary/>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: drawerSelector,
                })}>
                {showCalendar ? <Calendar/> : <EventsGrid/>}
            </main>
        </div>
    );
}