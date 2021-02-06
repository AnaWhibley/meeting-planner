import React from 'react';
import LuxonUtils from '@date-io/luxon';
import {DateTime} from 'luxon';
import {
    DatePicker as MuiDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {DATE_FORMAT} from '../../app/eventCreatorSlice';

interface DatePickerProps {
    value: DateTime;
    onChange: (date: DateTime) => void
    className?: string;
    label?: string;
    disabled?: boolean;
}

export function DatePicker(props: DatePickerProps){

    const {value, onChange, className, label, disabled} = props;
    return (
        <MuiPickersUtilsProvider utils={LuxonUtils}>
            <MuiDatePicker value={value}
                           autoOk={true}
                           label={label}
                           format={DATE_FORMAT}
                           onChange={onChange as any}
                           className={className}
                           disabled={disabled}
            />
        </MuiPickersUtilsProvider>
    )
}