import {useSelector} from 'react-redux';
import {selectEvents, selectFrom, selectGroupName, selectTo} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Collapse, Divider, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';

export function SummaryStage() {
    const events = useSelector(selectEvents);
    const from = useSelector(selectFrom).value;
    const to = useSelector(selectTo).value;
    const groupName = useSelector(selectGroupName)?.value;

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

        const participants = e.participants.map(p => {
            return (
                <>
                    <ListItem className={'ListItem'}>
                        <ListItemText primaryTypographyProps={{variant: 'h3', color: 'textSecondary'}} primary={p.tag}/>
                        <Typography color={'textPrimary'} variant="h3">{p.email.value}</Typography>
                    </ListItem>
                </>
            );
        });

        return (
            <div key={e.id}>
                <Divider />
                <List>
                    <ListItem button onClick={() => handleToggleEvent(index)}>
                        <ListItemText primary={"Evento " + (index + 1)} primaryTypographyProps={{variant: 'h3', color: 'primary'}} />
                        {!collapsedEvents[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={!collapsedEvents[index]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding className={'ParticipantsList'}>
                            <ListItem className={'ListItem'}>
                                <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Nombre del evento'}/>
                                <Typography color={'textPrimary'} variant="h3">{e.name.value}</Typography>
                            </ListItem>
                            <ListItem className={'ListItem'}>
                                <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Duración del evento'}/>
                                <Typography color={'textPrimary'} variant="h3">{e.duration.value} minutos</Typography>
                            </ListItem>
                            <ListItem button  onClick={() => handleToggleParticipants(index)}>
                                <ListItemText primary="Participantes" primaryTypographyProps={{variant: 'h3', color: 'primary'}} />
                                {!collapsedParticipants[index] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={!collapsedParticipants[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding className={'ParticipantsList'}>
                                    {participants}
                                </List>
                            </Collapse>
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    });

    return (
        <div className={'Body'}>
            <List>
                <ListItem>
                    <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Nombre de grupo de los eventos'}/>
                    <Typography color={'textPrimary'} variant="h3">{groupName}</Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primaryTypographyProps={{variant: 'h3', color: 'primary'}} primary={'Fecha de desarrollo de los eventos'}/>
                    <Typography color={'textSecondary'} variant="h3">desde{'\u00A0'}</Typography>
                    <Typography color={'textPrimary'} variant="h3">{'\u00A0'}{from}{'\u00A0'}</Typography>
                    <Typography color={'textSecondary'} variant="h3">{'\u00A0'}hasta{'\u00A0'}</Typography>
                    <Typography color={'textPrimary'} variant="h3">{'\u00A0'}{to}</Typography>
                </ListItem>
                {elements}
            </List>
        </div>
    );
}