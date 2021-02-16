import React from 'react';
import {IconButton, Tooltip as MuiTooltip} from '@material-ui/core';

interface TooltipProps {
    icon: JSX.Element;
    text: string;
    placement?:  'bottom' | 'left' | 'right' | 'top';
    onClick?: () => void;
}

export function Tooltip(props: TooltipProps) {
    return (
        <MuiTooltip title={props.text} placement={props.placement || 'bottom'} onClick={props.onClick}>
            <IconButton>
                {props.icon}
            </IconButton>
        </MuiTooltip>
    );
}