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
    IconButton, ListItemIcon,
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
    selectDrawerSelector,
    selectShowCalendar,
    setCurrentViewPlanner,
    setEventsGridSelectedTab,
    setSelectedRowInformation,
    showGrid,
    toggleDrawerSelectorTransition,
    toggleShowCalendar
} from '../../../app/uiStateSlice';
import {EventsGrid} from '../eventsGrid/EventsGrid';
import {
    selectEvents,
    selectParticipants,
    selectSelectedEvents,
    selectSelectedParticipants
} from '../../../app/planner/selectors';
import {setSelectedEvents, setSelectedParticipants } from '../../../app/planner/slice';
import {GroupedEventDto} from '../../../services/eventService';

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

    const handleToggle = (value: string) => () => {
        if(currentViewPlanner === 'busyDates') {
            dispatch(setSelectedParticipants(value));
        }else{
            dispatch(setSelectedEvents(value));
        }

    };

    const showCalendar = useSelector(selectShowCalendar);

    const participants = useSelector(selectParticipants);
    const selectedParticipants = useSelector(selectSelectedParticipants);

    const groupedEvents = useSelector(selectEvents);
    const selectedEvents = useSelector(selectSelectedEvents);


    const participantList = <List dense>
        {participants.map((value) => {
            return (
                <ListItem key={value.id} button>
                    <ListItemAvatar className={'ParticipantAvatar'}>
                        <AvatarInitials text={value.name} color={value.color}/>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography color={'textPrimary'} variant={'body1'}>{value.name}</Typography>}/>
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            style={{color: value.color}}
                            onChange={handleToggle(value.id)}
                            checked={selectedParticipants.indexOf(value.id) !== -1}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
        })}
    </List>;

    const showEventInfo = (id: string, index: number) => {
        dispatch(setSelectedRowInformation({eventId: id, groupId: index}));
        dispatch(setEventsGridSelectedTab(index));
        dispatch(showGrid());
    };

    const groupedEventList = groupedEvents.map((groupedEvent: GroupedEventDto, index: number) => {
        return (
            <Accordion defaultExpanded key={groupedEvent.groupName}>
                <AccordionSummary
                    expandIcon={<CirclePlusIcon className={'FillTextSecondary'}/>}
                >
                    <Typography variant={'h3'} color={'textSecondary'}>{groupedEvent.groupName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List dense>
                        {groupedEvent.events.map(event => {
                            return (
                                <ListItem key={event.id} dense button onClick={handleToggle(event.id)}>
                                    <ListItemIcon className={'Checkbox'}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedEvents.indexOf(event.id) !== -1}
                                            tabIndex={-1}
                                            color={'primary'}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography color={'textPrimary'} variant={'body1'}>{event.name}</Typography>}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => showEventInfo(event.id, index)}>
                                            <InfoIcon className={'FillPrimary'}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    });

    const AccordionList = (props: {title: string, list: any, className?: string}) => {
        return (<Accordion defaultExpanded className={props.className}>
            <AccordionSummary
                expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
            >
                <Typography variant={'h2'} color={'primary'}>{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails style={{flexDirection: 'column', display: 'flex'}}>
                {props.list}
            </AccordionDetails>
        </Accordion>);
    }

    return (
        <>
            {currentViewPlanner === 'busyDates' ?
                <AccordionList title={'Participantes'} list={participantList} className={'ParticipantsList'}/>
                :
                <AccordionList title={'Defensas'} list={groupedEventList} className={'GroupedEventList'}/>
            }
            <Accordion className={'ViewToggleContainer'}>
                <AccordionSummary
                    expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                >
                    <Typography variant={'h2'} color={'primary'}>Vista</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RadioGroup name="view" value={currentViewPlanner} onChange={handleChange} className={'ViewRadioGroup'} >
                        <FormControlLabel value="busyDates" control={<Radio color="primary" size={'small'}/>}
                                          label={<Typography color={'textPrimary'} variant={'body1'}>Mostrar indisponibilidades de participantes</Typography>}/>
                        <FormControlLabel value="events" control={<Radio color="primary" size={'small'}/>}
                                          label={<Typography color={'textPrimary'} variant={'body1'}>Mostrar eventos</Typography>}/>
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>
            <ActionButton color={Color.PRIMARY} variant={ButtonVariant.OUTLINED} innerText={showCalendar ? 'Ver detalles de defensas' : 'Ver calendario'}
                          onClick={() => dispatch(toggleShowCalendar())} className={'EventsDetailsButton'}/>
        </>
    );
}


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