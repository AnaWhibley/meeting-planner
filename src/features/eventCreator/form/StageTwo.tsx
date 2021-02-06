import {useDispatch, useSelector} from 'react-redux';
import {
    DATE_FORMAT,
    selectFrom,
    selectGroupName,
    selectTo,
    setFrom,
    setGroupName,
    setTo
} from '../../../app/eventCreatorSlice';
import React from 'react';
import {FormControlLabel, Radio, RadioGroup, Typography} from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';
import './Form.scss';
import SelectorField from '../../../components/selectorField/SelectorField';
import {DatePicker} from '../../../components/datePicker/DatePicker';
import {DateTime} from 'luxon';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import { Tooltip } from '../../../components/tooltip/Tooltip';

const options = [
    {label: 'First group', value: 'First group'},
    {label: 'Second group', value: 'Second group'},
    {label: 'Third group', value: 'Third group'}
];

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const groupName = useSelector(selectGroupName);
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('no');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                            onChange={(date: DateTime) => {dispatch(setFrom(date.toFormat(DATE_FORMAT)))}}
                />
                <DatePicker value={to}
                            className={'Input DatePicker'}
                            label={'Hasta'}
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
                <RadioGroup name='group' row value={value} onChange={handleChange} className={'Input'}>
                    <FormControlLabel value='yes' control={<Radio color={'primary'}/>} label='Sí' className={'RadioLabel'}/>
                    <FormControlLabel value='no' control={<Radio color={'primary'}/>} label='No' className={'RadioLabel'}/>
                </RadioGroup>
                {value === 'yes' ?
                    <SelectorField
                        items={options}
                        isMulti={false}
                        onChange={(data) => dispatch(setGroupName(data))}
                        value={groupName}
                        className={'Input'}
                    />
                    :
                    <TextInput type='text'
                               value={groupName?.value}
                               placeholder={'Nombre del grupo'}
                               fullWidth={true}
                               className={'Input'}
                               onChange={(value) => dispatch(setGroupName({label: value, value: value}))}
                    />
                }
            </div>

        </div>
    );
}