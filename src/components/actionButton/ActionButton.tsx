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
        return (
            <Button
                className={cn('ActionButton', this.props.className)}
                variant={this.props.variant}
                color={this.props.color}
                onClick={this.props.onClick}
            >
                <span className={this.props.labelClassName}>
                    {this.props.icon || null}
                    {this.props.innerText}
                </span>
            </Button>
        );
    }
}
