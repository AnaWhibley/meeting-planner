import {useDispatch, useSelector} from 'react-redux';
import {
    DATE_FORMAT,
    setFrom,
    setGroupName,
    setTo
} from '../../../app/eventCreator/slice';
import React from 'react';
import {FormControlLabel, Radio, RadioGroup, Typography} from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';
import './Form.scss';
import SelectorField from '../../../components/selectorField/SelectorField';
import {DatePicker} from '../../../components/datePicker/DatePicker';
import {DateTime} from 'luxon';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import { Tooltip } from '../../../components/tooltip/Tooltip';
import {selectEvents, selectFrom, selectGroupName, selectTo } from '../../../app/eventCreator/selectors';
import {selectEvents as selectGroupedEvents} from '../../../app/planner/selectors';

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const fromError = useSelector(selectFrom).errorMessage;
    const toError = useSelector(selectTo).errorMessage;
    const groupName = useSelector(selectGroupName);
    const dispatch = useDispatch();
    const disableFields = useSelector(selectEvents).length > 1;

    const groupedEvents = useSelector(selectGroupedEvents);

    const options = groupedEvents.map(groupedEvent => {
        return {
            label: groupedEvent.groupName,
            value: groupedEvent.groupName
        }
    });

    const [existingGroupedEvent, setExistingGroupedEvent] = React.useState(false);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExistingGroupedEvent(!existingGroupedEvent);
        clearFields();
    };

    const clearFields = () => {
        dispatch(setFrom(DateTime.utc().toFormat(DATE_FORMAT)));
        dispatch(setTo(DateTime.utc().toFormat(DATE_FORMAT)));
        dispatch(setGroupName({label: '', value: ''}));
    };

    const handleSelectorChange = (data: { label: string, value: string }) => {
        dispatch(setGroupName(data));
        if(existingGroupedEvent){
            const groupedEventInfo = groupedEvents.find(groupedEvent => groupedEvent.groupName === data.value);
            if(groupedEventInfo){
                dispatch(setFrom(groupedEventInfo.from));
                dispatch(setTo(groupedEventInfo.to));
            }
        }
    };

    return (
        <div className={'Body'}>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Este evento pertenece a un grupo creado anteriormente?
                    <Tooltip icon={<InfoIcon className={'InfoIcon'}/>}
                             placement={'right'}
                             text={'Este valor se conservará para el resto de eventos que crees hasta que confirmes los cambios.'}/>
                </Typography>
                <RadioGroup name='group' row value={existingGroupedEvent} onChange={handleRadioChange} className={'Input'} >
                    <FormControlLabel value={true} control={<Radio color={'primary'}/>} label='Sí' className={'RadioLabel'} disabled={disableFields}/>
                    <FormControlLabel value={false} control={<Radio color={'primary'}/>} label='No' className={'RadioLabel'} disabled={disableFields}/>
                </RadioGroup>
                {existingGroupedEvent ?
                    <SelectorField
                        items={options}
                        isMulti={false}
                        onChange={(data) => handleSelectorChange(data)}
                        value={groupName.value.label === '' ? undefined : groupName.value}
                        className={'Input'}
                        isDisabled={disableFields}
                    />
                    :
                    <TextInput type='text'
                               value={groupName.value.label}
                               placeholder={'Nombre del grupo'}
                               error={!!groupName.errorMessage}
                               errorMessage={groupName.errorMessage}
                               fullWidth={true}
                               className={'Input'}
                               disabled={disableFields}
                               onChange={(value) => dispatch(setGroupName({label: value, value: value}))}
                    />
                }
            </div>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Entre qué fechas se podrá desarrollar el evento o el grupo de eventos?
                    <Tooltip icon={<InfoIcon className={'InfoIcon'}/>}
                             text={'Este valor se conservará para el resto de eventos que crees hasta que confirmes los cambios.'}
                             placement={'right'}
                    />
                </Typography>
                <DatePicker value={from}
                            className={'Input DatePicker'}
                            label={'Desde'}
                            disabled={existingGroupedEvent || disableFields}
                            error={!!fromError}
                            errorMessage={fromError}
                            onChange={(date: DateTime) => {dispatch(setFrom(date.toFormat(DATE_FORMAT)))}}
                />
                <DatePicker value={to}
                            className={'Input DatePicker'}
                            label={'Hasta'}
                            error={!!toError}
                            errorMessage={toError}
                            disabled={existingGroupedEvent || disableFields}
                            onChange={(date: DateTime) => {dispatch(setTo(date.toFormat(DATE_FORMAT)))}}
                />
            </div>
        </div>
    );
}