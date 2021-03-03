import React from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import {DateTime} from 'luxon';
import {statusMapper} from './EventsGrid';
import {ValueFormatterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../../app/login/selectors';
import {Role} from '../../../services/userService';
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import {ReactComponent as OptionsIcon} from '../../../assets/icons/evericons/options.svg';
import {ReactComponent as EyeNoIcon} from '../../../assets/icons/evericons/eye-no.svg';
import {ReactComponent as EyeIcon} from '../../../assets/icons/evericons/eye.svg';
import {ReactComponent as BellIcon} from '../../../assets/icons/evericons/bell.svg';
import '../../../styles/common.scss'
import {Tooltip} from '../../../components/tooltip/Tooltip';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import './EventsGrid.scss';

export function StatusRenderer (props: ICellRendererParams) {
    return statusMapper(props.value).element;
}

export function DateRenderer (props: ICellRendererParams) {
    if(props.value === 'pending'){
        return <div className={'StatusPending PendingDashDate'}>-</div>;
    }
    const date = DateTime.fromFormat(props.value, 'yyyy M dd').toFormat('dd/MM/yyyy');
    return <>{date}</>;
}

export function HourRenderer (props: ICellRendererParams) {
    if(props.value === 'pending'){
        return <div className={'StatusPending PendingDashHour'}>-</div>;
    }
    return <>{props.value}</>;
}

export function ActionsRenderer (props: ICellRendererParams) {
    const user = useSelector(selectLoggedInUser);
    const eye = <div className={'EyeIconContainer'}>
        <Tooltip icon={<EyeIcon/>}
                 text={'Mostrar más información'}
                 placement={'bottom'}
                 onClick={() => console.log('Selected Row')}
        />
    </div>;
    if(user && user.role === Role.ADMIN) {
        return (
            <div className={'ActionIcons'}>
                {eye}
                {props.data.status !== 'confirmed' ?
                    <>
                        <div className={'BellIconContainer'}>
                            <Tooltip icon={<BellIcon/>}
                                     text={'Enviar recordatorio'}
                                     placement={'bottom'}/>
                        </div>
                        <div className={'OptionsIconContainer'}>
                            <Tooltip icon={<OptionsIcon/>}
                                     text={'Editar'}
                                     placement={'bottom'}/>
                        </div>
                        <div className={'TrashIconContainer'}>
                            <Tooltip icon={<TrashIcon/>}
                                     text={'Eliminar'}
                                     placement={'bottom'}/>
                        </div>
                    </>
                    : null}
            </div>
        );
    }else{
        return eye;
    }
}

export const durationFormatter = (params: ValueFormatterParams) => {
        return params.value + ' minutos';
    };
