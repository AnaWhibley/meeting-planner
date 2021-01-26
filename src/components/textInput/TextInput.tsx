import React, {Component} from 'react';
import {Grid, TextField} from '@material-ui/core';
import './TextInput.scss';

interface TextInputProps {
    placeholder?: string;
    className?: string;
    icon?: any;
    type?: string;
    onChange: (value: string) => void;
    value: string;
}

export default class TextInput extends Component<TextInputProps>{
    render() {
        return (
            <div>
                {this.props.icon ?
                    <Grid container spacing={1} alignItems="flex-end" className={"TextInputHasIcon"}>
                        <Grid item>
                            {this.props.icon}
                        </Grid>
                        <Grid item>
                            <TextField label={this.props.placeholder}
                                       type={this.props.type}
                                       value={this.props.value}
                                       onChange={(ev) => this.props.onChange(ev.target.value)}
                            />
                        </Grid>
                    </Grid>
                    : <TextField label={this.props.placeholder} type={this.props.type}/> }
            </div>
        );
    }
}
