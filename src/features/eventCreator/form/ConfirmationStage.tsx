import React from 'react';
import {Typography} from '@material-ui/core';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {exportJSON} from '../../../app/eventCreator/slice';
import {Color} from '../../../styles/theme';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {ReactComponent as ExportIcon} from '../../../assets/icons/evericons/download.svg';
import {ReactComponent as CalendarDatesIcon} from '../../../assets/icons/evericons/calendar-dates.svg';
import '../../../styles/common.scss';
export function ConfirmationStage() {

    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <div className={'Body'}>
            <div className={'ConfirmationContainer'}>
                <Typography className={'ConfirmationMessage'} color={'textSecondary'} variant='h3'>Se han creado correctamente los eventos definidos y
                    se ha notificado correctamente a las personas a las personas incluidas en cada evento. </Typography>

                <div className={'ExportJSONContainer'}>
                    <Typography color={'textSecondary'} variant='h3'>¿Desea exportar a JSON los eventos creados?</Typography>
                    <ActionButton onClick={() => dispatch(exportJSON())}
                                  color={Color.PRIMARY}
                                  innerText={''}
                                  labelClassName={'ExportButtonLabel'}
                                  icon={<ExportIcon className={'ExportIcon FillPrimary'}/>}
                                  variant={ButtonVariant.OUTLINED}/>
                </div>

                <ActionButton onClick={() => history.push('/')}
                              className={'CalendarButton'}
                              icon={<CalendarDatesIcon className={'CalendarIcon FillWhite'}/>}
                              labelClassName={'CalendarButtonLabel'}
                              color={Color.PRIMARY}
                              innerText={' Ver los eventos creados en el calendario'}
                              variant={ButtonVariant.CONTAINED}/>
            </div>
        </div>
    );
}