import React from 'react';
import {TextField} from '@material-ui/core';

interface DurationPickerProps {
    value: number;
    onChange: (duration: number) => void
    className?: string;
    label?: string;
    fullWidth?: boolean;
    errorMessage?: string;
    error?: boolean;
}

export function DurationPicker(props: DurationPickerProps){

    const {value, onChange, className, label, fullWidth, error, errorMessage} = props;
    return (
        <TextField label={label}
                   error={error}
                   helperText={errorMessage}
                   type={'number'}
                   fullWidth={fullWidth}
                   value={value}
                   onChange={(ev) => onChange(Number(ev.target.value))}
                   className={className}
                   InputProps={{
                       inputProps: {
                           max: 300,
                           min: 10,
                           step: 15,
                       },
                       style: { fontSize: 16 }
                   }}
        />
    )
}