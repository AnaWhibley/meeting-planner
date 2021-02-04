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
}

export function DatePicker(props: DatePickerProps){

    const {value, onChange, className} = props;
    return (
        <MuiPickersUtilsProvider utils={LuxonUtils}>
            <MuiDatePicker value={value}
                           format={DATE_FORMAT}
                           onChange={onChange as any}
                           className={className}
            />
        </MuiPickersUtilsProvider>
    )
}