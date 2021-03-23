import React, {useState} from 'react';
import { AvatarInitials } from '../avatarInitials/AvatarInitials';
import {Snackbar, Typography} from '@material-ui/core';
import {ReactComponent as MailIcon} from '../../assets/icons/evericons/mail.svg';
import {ReactComponent as TagIcon} from '../../assets/icons/evericons/tag.svg';
import {ReactComponent as CalendarCheckedIcon} from '../../assets/icons/evericons/calendar-checked.svg';
import './ParticipantInfo.scss';
import '../../styles/common.scss'
import {useSelector} from 'react-redux';
import {selectBusyByEmail, selectNameByEmail} from '../../app/planner/selectors';
import {RootState} from '../../app/store';
import {ParticipantDto} from '../../services/eventService';
import {Alert} from "../alert/Alert";

export function ParticipantInfo(props: { participant: ParticipantDto }) {
    const name = useSelector((state: RootState) => selectNameByEmail(state, props.participant.email));
    const busy = useSelector((state: RootState) => selectBusyByEmail(state, props.participant.email));

    const copyToClipboard = (value: string) => () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
        });
    };

    const [copied, setCopied] = useState(false);

    return (
        <>
            <div className={'ParticipantInfoContainer'}>
                <div className={'Avatar'}><AvatarInitials text={name}/></div>
                <Typography color={'textSecondary'} display={'inline'} className={'Bold'}>{name}</Typography>
                <div className={'Info'}>
                    <div onClick={copyToClipboard(props.participant.email)} className={'MailInformation'}>
                        <MailIcon className={'FillTextSecondary Icon'}/>
                        <Typography color={'textSecondary'} display={'inline'} className={'Text'}>{props.participant.email}</Typography>
                    </div>
                    <div>
                        <TagIcon className={'FillTextSecondary Icon'}/>
                        <Typography color={'textSecondary'} display={'inline'} className={'Text'}>{props.participant.tag}</Typography>
                    </div>
                    <div>
                        <CalendarCheckedIcon className={'FillTextSecondary Icon'}/>
                        <Typography color={'textSecondary'} display={'inline'} className={'Text'}>{busy ? 'Indisponibilidades proporcionadas' : 'Indisponibilidades NO proporcionadas'}</Typography>
                    </div>
                </div>
            </div>
            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
                <Alert severity="success" onClose={() => setCopied(false)}>
                    ¡Se ha copiado {props.participant.email} al portapapeles!
                </Alert>
            </Snackbar>
        </>

    );
}
