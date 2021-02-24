import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel, IconButton, ListItemIcon,
    Radio,
    RadioGroup,
    Typography
} from '@material-ui/core';
import {ReactComponent as CirclePlusIcon} from '../../../assets/icons/evericons/circle-plus.svg';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import '../../../styles/common.scss';
import {AvatarInitials} from '../../../components/avatarInitials/AvatarInitials';
import './ViewSelector.scss';

export function ViewSelector() {
    return (
        <>
            <CheckboxListSecondary/>
        </>
    );
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export default function CheckboxListSecondary() {
    const classes = useStyles();


    const [value, setValue] = React.useState('busyDates');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
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

    return (
        <>
            {value === 'busyDates' ?
            <Accordion defaultExpanded className={'Accordion'}>
                <AccordionSummary
                    expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                >
                    <Typography variant={'h2'} color={'primary'}>Participantes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List dense className={classes.root}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
                            const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem key={value} button>
                                    <ListItemAvatar>
                                        <AvatarInitials userName={`Avatar ${value + 1}`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            color="primary"
                                            onChange={handleToggle(value)}
                                            checked={checked.indexOf(value) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }}
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
                        <List className={classes.root}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
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
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
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
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<CirclePlusIcon className={'FillPrimary'}/>}
                >
                    <Typography variant={'h2'} color={'primary'}>Vista</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RadioGroup name="view" value={value} onChange={handleChange}>
                        <FormControlLabel value="busyDates" control={<Radio color="primary"/>} label="Mostrar indisponibilidades de participantes" />
                        <FormControlLabel value="events" control={<Radio color="primary"/>} label="Mostrar defensas" />
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>
        </>
    );
}