import {useDispatch, useSelector} from 'react-redux';
import {
    selectCurrentViewPlanner,
    selectShowCalendar,
    setCurrentViewPlanner, setEventsGridSelectedTab,
    setSelectedRowInformation, showGrid, toggleShowCalendar, ViewPlanner
} from '../../../app/uiStateSlice';
import React from 'react';
import {setSelectedEvents, setSelectedParticipants, toggleAllEventsSelected} from '../../../app/planner/slice';
import {
    selectEvents,
    selectParticipants,
    selectSelectedEvents,
    selectSelectedParticipants
} from '../../../app/planner/selectors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {AvatarInitials} from '../../../components/avatarInitials/AvatarInitials';
import ListItemText from '@material-ui/core/ListItemText';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, FormControlLabel,
    IconButton,
    ListItemIcon, Radio,
    RadioGroup,
    Typography
} from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import {GroupedEventDto} from '../../../services/eventService';
import {ReactComponent as CirclePlusIcon} from '../../../assets/icons/evericons/circle-plus.svg';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import '../../../styles/common.scss';
import './ViewSelector.scss';

export function DrawerContent() {

    const dispatch = useDispatch();
    const currentViewPlanner = useSelector(selectCurrentViewPlanner);
    const handleChangeView = () => {
        const newView = currentViewPlanner === ViewPlanner.EVENTS ? ViewPlanner.BUSY_DATES : ViewPlanner.EVENTS;
        dispatch(setCurrentViewPlanner(newView));
    };

    const handleToggle = (value: string, index?: number) => () => {
        if(currentViewPlanner === ViewPlanner.BUSY_DATES) {
            dispatch(setSelectedParticipants(value));
        }else{
            dispatch(setSelectedEvents({eventId: value, groupId: index}));
        }

    };

    const showCalendar = useSelector(selectShowCalendar);

    const participants = useSelector(selectParticipants);
    const selectedParticipants = useSelector(selectSelectedParticipants);

    const groupedEvents = useSelector(selectEvents);
    const selectedEvents = useSelector(selectSelectedEvents);

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
                        <FormControlLabel control={<Checkbox checked={selectedEvents[index].length === groupedEvent.events.length} onChange={() => dispatch(toggleAllEventsSelected({groupIndex: index}))}/>}
                                          label={<Typography color={'textPrimary'} variant={'body1'}>Seleccionar todos</Typography>}
                                          className={'SelectAll'}
                        />
                        {groupedEvent.events.map(event => {
                            return (
                                <ListItem key={event.id} dense button onClick={handleToggle(event.id, index)}>
                                    <ListItemIcon className={'Checkbox'}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedEvents[index].indexOf(event.id) !== -1}
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

    return (
        <>
            {currentViewPlanner === ViewPlanner.BUSY_DATES ?
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
                    <RadioGroup name="view" value={currentViewPlanner} onChange={handleChangeView} className={'ViewRadioGroup'} >
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