import React from 'react';
import {IconButton, Tooltip as MuiTooltip} from '@material-ui/core';

interface TooltipProps {
    icon: JSX.Element;
    text: string;
    placement?:  'bottom' | 'left' | 'right' | 'top';
}

export function Tooltip(props: TooltipProps) {
    return (
        <MuiTooltip title={props.text} placement={props.placement || 'bottom'}>
            <IconButton>
                {props.icon}
            </IconButton>
        </MuiTooltip>
    );
}