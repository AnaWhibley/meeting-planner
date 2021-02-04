import React, {Component} from 'react';
import cn from 'classnames';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './SelectorField.scss';

interface SelectorFieldProps {
    items: Array<any>;
    label?: string;
    isMulti?: boolean;
    onChange: (data: any) => void;
    value: any;
    isDisabled?: boolean;
    error?: boolean;
    helperText?: string;
    className?: string;
}
const animatedComponents = makeAnimated();

const formatGroupLabel = (data: any) => (
    <div className='groupStyles'>
        <span>{data.label}</span>
        <span>{data.options.length}</span>
    </div>
);

export default class SelectorField extends Component<SelectorFieldProps>{

    render() {
        const showError = this.props.error && !this.props.isDisabled;
        const helperText = showError ? <p className="SelectorFieldErrorMessage">{this.props.helperText}</p> : null;
        return (
            <div className='SelectorFieldWrapper'>
                <label className={cn('SelectorFieldLabel', {
                    'SelectorFieldLabelError': showError
                })}>{this.props.label}</label>
                <Select
                    className={cn('SelectorFieldInput', this.props.className, {
                        'SelectorFieldInputError': showError
                    })}
                    options={this.props.items}
                    isMulti={this.props.isMulti}
                    closeMenuOnSelect={!this.props.isMulti}
                    components={animatedComponents}
                    formatGroupLabel={formatGroupLabel}
                    onChange={(value) => this.props.onChange(value)}
                    value={this.props.value}
                    placeholder="Seleccione una opción"
                    isDisabled={this.props.isDisabled}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: '#bdb9fc',
                            primary: '#6C63FF',
                        },
                    })}
                />
                {helperText}
            </div>
        );
    }
}