import React from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import {statusMapper} from './EventsGrid';
import {ValueFormatterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import {useDispatch, useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../../app/login/selectors';
import {Role} from '../../../services/userService';
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import {ReactComponent as OptionsIcon} from '../../../assets/icons/evericons/options.svg';
import {ReactComponent as EyeIcon} from '../../../assets/icons/evericons/eye.svg';
import {ReactComponent as BellIcon} from '../../../assets/icons/evericons/bell.svg';
import '../../../styles/common.scss'
import {Tooltip} from '../../../components/tooltip/Tooltip';
import './EventsGrid.scss';
import {selectEventsGridSelectedTab, setSelectedRowInformation} from '../../../app/uiStateSlice';

export function StatusRenderer (props: ICellRendererParams) {
    return statusMapper(props.value).element;
}

export function DateRenderer (props: ICellRendererParams) {
    if(props.value === 'pending'){
        return <div className={'StatusPending PendingDashDate'}>-</div>;
    }
    return <>{props.value}</>;
}

export function HourRenderer (props: ICellRendererParams) {
    if(props.value === 'pending'){
        return <div className={'StatusPending PendingDashHour'}>-</div>;
    }
    return <>{props.value}</>;
}

export function ActionsRenderer (props: ICellRendererParams) {
    const user = useSelector(selectLoggedInUser);
    const currentTab = useSelector(selectEventsGridSelectedTab);

    const dispatch = useDispatch();
    const onRowClicked = () => {
        dispatch(setSelectedRowInformation({eventId: props.data.id, groupId: currentTab}))
    }

    const eye = <div className={'EyeIconContainer'}>
        <Tooltip icon={<EyeIcon/>}
                 text={'Mostrar más información'}
                 placement={'bottom'}
                 onClick={onRowClicked}
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
        return <div className={'ActionIcons'}>{eye}</div>;
    }
}

export const durationFormatter = (params: ValueFormatterParams) => {
    return params.value + ' minutos';
};

export function ColorRenderer (props: ICellRendererParams) {
    return (
        <>
            <div style={{backgroundColor: props.value}} className={'DotColorRenderer'}/>
        </>
    )
}