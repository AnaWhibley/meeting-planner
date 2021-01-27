import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import './ActionButton.scss';
import cn from "classnames";
import {Color} from '../../styles/theme';

interface ActionButtonProps {
    innerText: string;
    variant: ButtonVariant;
    color: Color;
    labelClassName?: string;
    className?: string;
    icon?: any;
    onClick: () => void;
}

export enum ButtonVariant {
    CONTAINED = "contained",
    OUTLINED = "outlined"
}

export default class ActionButton extends Component<ActionButtonProps>{
    render() {
        const {variant, color, icon, innerText, onClick, className, labelClassName} = this.props;
        return (
            <Button
                className={cn('ActionButton', className)}
                variant={variant}
                color={color}
                onClick={onClick}
            >
                <span className={labelClassName}>
                    {icon || null}
                    {innerText}
                </span>
            </Button>
        );
    }
}
