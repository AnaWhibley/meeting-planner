import React, {Component} from 'react';
import {Grid, TextField} from '@material-ui/core';
import './TextInput.scss';

interface TextInputProps {
    placeholder?: string;
    className?: string;
    icon?: any;
    type?: string;
    fullWidth?: boolean;
    onChange: (value: string) => void;
    value: string;
}

export default class TextInput extends Component<TextInputProps>{
    render() {
        const {icon, placeholder, fullWidth, value, type, onChange} = this.props;
        const textField = (
            <TextField label={placeholder}
                       fullWidth={fullWidth}
                       type={type}
                       value={value}
                       onChange={(ev) => onChange(ev.target.value)}
            />
        );
        return (
            <>
                {icon ?
                    <Grid container spacing={1} alignItems="flex-end" className={"TextInputWrapper"}>
                        <Grid>
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
