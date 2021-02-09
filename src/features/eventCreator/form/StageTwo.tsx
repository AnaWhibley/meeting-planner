import {useDispatch, useSelector} from 'react-redux';
import {
    DATE_FORMAT,
    setFrom,
    setGroupName,
    setTo
} from '../../../app/eventCreator/eventCreatorSlice';
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

const options = [
    {label: 'First group', value: 'First group'},
    {label: 'Second group', value: 'Second group'},
    {label: 'Third group', value: 'Third group'}
];

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const fromError = useSelector(selectFrom).errorMessage;
    const toError = useSelector(selectTo).errorMessage;
    const groupName = useSelector(selectGroupName);
    const dispatch = useDispatch();
    const disableFields = useSelector(selectEvents).length > 1;

    const [value, setValue] = React.useState('no');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <div className={'Body'}>
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
                            disabled={disableFields}
                            error={!!fromError}
                            errorMessage={fromError}
                            onChange={(date: DateTime) => {dispatch(setFrom(date.toFormat(DATE_FORMAT)))}}
                />
                <DatePicker value={to}
                            className={'Input DatePicker'}
                            label={'Hasta'}
                            error={!!toError}
                            errorMessage={toError}
                            disabled={disableFields}
                            onChange={(date: DateTime) => {dispatch(setTo(date.toFormat(DATE_FORMAT)))}}
                />
            </div>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Este evento pertenece a un grupo creado anteriormente?
                    <Tooltip icon={<InfoIcon className={'InfoIcon'}/>}
                             placement={'right'}
                             text={'Este valor se conservará para el resto de eventos que crees hasta que confirmes los cambios.'}/>
                </Typography>
                <RadioGroup name='group' row value={value} onChange={handleRadioChange} className={'Input'} >
                    <FormControlLabel value='yes' control={<Radio color={'primary'}/>} label='Sí' className={'RadioLabel'} disabled={disableFields}/>
                    <FormControlLabel value='no' control={<Radio color={'primary'}/>} label='No' className={'RadioLabel'} disabled={disableFields}/>
                </RadioGroup>
                {value === 'yes' ?
                    <SelectorField
                        items={options}
                        isMulti={false}
                        onChange={(data) => dispatch(setGroupName(data))}
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

        </div>
    );
}