import {useDispatch, useSelector} from 'react-redux';
import {editEvent, selectEvents, selectFrom, selectGroupName, selectTo} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Collapse, Divider, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {ReactComponent as EditIcon} from '../../../assets/icons/evericons/pencil-edit.svg';

export function SummaryStage() {
    const events = useSelector(selectEvents);
    const from = useSelector(selectFrom).value;
    const to = useSelector(selectTo).value;
    const groupName = useSelector(selectGroupName)?.value;
    const dispatch = useDispatch();

    const [collapsedEvents, setCollapsedEvents] = React.useState<Array<boolean>>([]);
    const [collapsedParticipants, setCollapsedParticipants] = React.useState<Array<boolean>>([]);

    const handleToggleEvent = (index: number) => {
        const newState: Array<boolean> = collapsedEvents.slice();
        newState[index] = newState[index] === undefined ? true : !newState[index];
        setCollapsedEvents(newState);
    };

    const handleToggleParticipants = (index: number) => {
        const newState: Array<boolean> = collapsedParticipants.slice();
        newState[index] = newState[index] === undefined ? true : !newState[index];
        setCollapsedParticipants(newState);
    };


    const elements = events.map((e, index) => {

        const participants = e.participants.map((p, i) => {
            return (
                <React.Fragment key={i}>
                    <ListItem className={'ListItem'}>
                        <ListItemText primaryTypographyProps={{variant: 'h3', color: 'textSecondary'}} primary={p.tag}/>
                        <Typography color={'textPrimary'} variant='h3'>{p.email.value}</Typography>
                    </ListItem>
                </React.Fragment>
            );
        });

        return (
            <React.Fragment key={index}>
                <Divider />
                <List>
                    <ListItem button onClick={() => handleToggleEvent(index)}>
                        <ListItemText primary={'Evento ' + (index + 1)} primaryTypographyProps={{variant: 'h3', color: 'primary'}} />
                        {!collapsedEvents[index] ? <ExpandLess className={'ExpandLessIcon'}/> : <ExpandMore className={'ExpandMoreIcon'}/>}
                        <ListItemIcon className={'EditIcon'}>
                            <EditIcon onClick={ev => {
                                ev.stopPropagation();
                                dispatch(editEvent({currentIndex: index}));
                            }}/>
                        </ListItemIcon>
                    </ListItem>
                    <Collapse in={!collapsedEvents[index]} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding className={'ParticipantsList'}>
                            <ListItem className={'ListItem'}>
                                <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Nombre del evento'}/>
                                <Typography color={'textPrimary'} variant='h3'>{e.name.value}</Typography>
                            </ListItem>
                            <ListItem className={'ListItem'}>
                                <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Duración del evento'}/>
                                <Typography color={'textPrimary'} variant='h3'>{e.duration.value} minutos</Typography>
                            </ListItem>
                            <ListItem button  onClick={() => handleToggleParticipants(index)}>
                                <ListItemText primary='Participantes' primaryTypographyProps={{variant: 'h3', color: 'primary'}} />
                                {!collapsedParticipants[index] ? <ExpandLess className={'ExpandLessIcon'}/> : <ExpandMore className={'ExpandMoreIcon'}/>}
                            </ListItem>
                            <Collapse in={!collapsedParticipants[index]} timeout='auto' unmountOnExit>
                                <List component='div' disablePadding className={'ParticipantsList'}>
                                    {participants}
                                </List>
                            </Collapse>
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>
        );
    });

    return (
        <div className={'Body'}>
            <List>
                <ListItem>
                    <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Nombre de grupo de los eventos'}/>
                    <Typography color={'textPrimary'} variant='h3' className={'EditGroupDetails EditGroupDetailsMargin'}>{groupName}</Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Fecha de desarrollo de los eventos'}/>
                    <div className={'EditGroupDetails'}>
                        <Typography color={'textSecondary'} variant='h3' display={'inline'}>desde{'\u00A0'}</Typography>
                        <Typography color={'textPrimary'} variant='h3' display={'inline'}>{'\u00A0'}{from}{'\u00A0'}</Typography>
                        <Typography color={'textSecondary'} variant='h3' display={'inline'}>{'\u00A0'}hasta{'\u00A0'}</Typography>
                        <Typography color={'textPrimary'} variant='h3' display={'inline'}>{'\u00A0'}{to}</Typography>
                    </div>
                    <ListItemIcon className={'EditIcon EditGroupDetails'} onClick={() => dispatch(editEvent({stage:1, currentIndex: 0}))}>
                        <EditIcon/>
                    </ListItemIcon>
                </ListItem>
                {elements}
            </List>
        </div>
    );
}