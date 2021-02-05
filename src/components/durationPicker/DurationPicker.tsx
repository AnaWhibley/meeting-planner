import React from 'react';
import {TextField} from '@material-ui/core';

interface DurationPickerProps {
    value: number;
    onChange: (duration: number) => void
    className?: string;
    label?: string;
    fullWidth?: boolean;
}

export function DurationPicker(props: DurationPickerProps){

    const {value, onChange, className, label, fullWidth} = props;
    return (
        <TextField defaultValue={60}
                   label={label}
                   type={'number'}
                   fullWidth={fullWidth}
                   value={value}
                   onChange={(ev) => onChange(Number(ev.target.value))}
                   className={className}
                   InputProps={{
                       inputProps: {
                           max: 120,
                           min: 30,
                           step: 15,
                       },
                       style: { fontSize: 16 }
                   }}
        />
    )
}