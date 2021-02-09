import React, {Component} from 'react';
import {Grid, TextField} from '@material-ui/core';
import './TextInput.scss';
import cn from 'classnames';

interface TextInputProps {
    errorMessage?: string;
    error?: boolean;
    placeholder?: string;
    label?: string;
    containerClassName?: string;
    className?: string;
    icon?: any;
    type?: string;
    fullWidth?: boolean;
    onChange: (value: string) => void;
    value?: string;
    disabled?: boolean;
}

export default class TextInput extends Component<TextInputProps>{
    render() {
        const {icon, placeholder, fullWidth, value, type, onChange, label, containerClassName, className, disabled, error, errorMessage} = this.props;
        const textField = (
            <TextField placeholder={placeholder}
                       error={error}
                       helperText={errorMessage}
                       label={label}
                       type={type}
                       fullWidth={fullWidth}
                       value={value}
                       InputProps={{ style: { fontSize: 16 } }}
                       onChange={(ev) => onChange(ev.target.value)}
                       className={className}
                       disabled={disabled}
            />
        );

        return (
            <>
                {icon ?
                    <Grid container spacing={1} alignItems="flex-end" className={cn('TextInputWrapper', containerClassName)}>
                        <Grid className={'TextInputIcon'}>
                            {icon}
                        </Grid>
                        <Grid item>
                            {textField}
                        </Grid>
                    </Grid>
                    : textField}
            </>
        );
    }
}
