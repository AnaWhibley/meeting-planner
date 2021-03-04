import React from 'react';
import { AvatarInitials } from '../avatarInitials/AvatarInitials';
import {Typography} from '@material-ui/core';
import {ReactComponent as MailIcon} from '../../assets/icons/evericons/mail.svg';
import {ReactComponent as TagIcon} from '../../assets/icons/evericons/tag.svg';
import {ReactComponent as CalendarCheckedIcon} from '../../assets/icons/evericons/calendar-checked.svg';
import './ParticipantInfo.scss';
import '../../styles/common.scss'
import {useSelector} from 'react-redux';
import {selectBusyByEmail, selectNameByEmail} from '../../app/planner/selectors';
import {RootState} from '../../app/store';
import {ParticipantDto} from '../../services/eventService';

export function ParticipantInfo(props: { participant: ParticipantDto }) {
    const name = useSelector((state: RootState) => selectNameByEmail(state, props.participant.email));
    const busy = useSelector((state: RootState) => selectBusyByEmail(state, props.participant.email));
    return (
        <div className={'ParticipantInfoContainer'}>
            <div className={'Avatar'}><AvatarInitials text={name}/></div>
            <Typography  color={'textSecondary'} display={'inline'} className={'Bold'}>{name}</Typography>
            <div className={'Info'}>
                <div>
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
    );
}