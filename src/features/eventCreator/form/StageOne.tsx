import {useDispatch, useSelector} from 'react-redux';
import {selectGroupName, selectName, setGroupName, setName} from '../../../app/eventCreatorSlice';
import React from 'react';
import {FormControlLabel, Radio, RadioGroup, Typography} from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';
import './Form.scss';
import SelectorField from '../../../components/selectorField/SelectorField';

const options = [
    {label: 'First group', value: 'First group'},
    {label: 'Second group', value: 'Second group'},
    {label: 'Third group', value: 'Third group'}
];

export function StageOne() {
    const name = useSelector(selectName).value;
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
                    ¿Cómo se llamará el evento?
                </Typography>
                <TextInput type='text'
                           value={name}
                           placeholder={'Nombre del evento'}
                           fullWidth={true}
                           className={'Input'}
                           onChange={(value) => dispatch(setName(value))}
                />
            </div>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Este evento pertenece a un grupo creado anteriormente?
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