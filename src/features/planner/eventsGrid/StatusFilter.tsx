import React, {Component} from 'react';
import {IDoesFilterPassParams, IFilterParams} from 'ag-grid-community';
import {Checkbox, List, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import {RootState} from '../../../app/store';
import {resetStatusFilter, setSelectedOptionsStatusFilter} from '../../../app/uiStateSlice';
import {connect} from 'react-redux';
import {statusMapper} from './EventsGrid';
import cn from 'classnames';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';

class StatusFilter extends Component<{selectedOptions: Array<string>, setSelectedOptions: (value: string) => void, availableOptions: Array<string>, resetFilter: () => void} & IFilterParams>{

    onCheckboxPressed(value: string) {
        this.props.setSelectedOptions(value);
        requestAnimationFrame(this.props.filterChangedCallback);
    }

    isFilterActive()  {
        return this.props.selectedOptions.length !== 3;
    };

    doesFilterPass(params: IDoesFilterPassParams) {
        return this.props.selectedOptions.includes(params.data.status);
    }

    render() {
        return (
            <>
                <List dense className={'StatusFilterList'}>
                    <ListSubheader component="div">Filtro</ListSubheader>
                    {['confirmed', 'pending', 'error'].map((value) => {
                        const disabled = !this.props.availableOptions.includes(value);
                        return (
                            <ListItem key={value} button>
                                <ListItemIcon>
                                    <Checkbox
                                        disabled={disabled}
                                        edge='start'
                                        onChange={() => this.onCheckboxPressed(value)}
                                        checked={this.props.selectedOptions.indexOf(value) !== -1}
                                        className={disabled ? '' : statusMapper(value).style}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    className={cn({'CheckboxDisabled': !this.props.availableOptions.includes(value)})}
                                    id={value}
                                    primary={statusMapper(value).value}
                                />
                            </ListItem>
                        );
                    })}
                </List>
                <ActionButton innerText={'Resetear'}
                              variant={ButtonVariant.TEXT}
                              color={Color.PRIMARY}
                              onClick={() => {
                                  this.props.resetFilter();
                                  setTimeout(() => {
                                          this.props.api.setFilterModel(null);
                                          this.props.api.onFilterChanged();
                                          }, 0);
                              }}
                              className={'ResetButton'}
                              labelClassName={'ResetLabelButton'}/>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        selectedOptions: state.uiState.selectedOptionsStatusFilter,
        availableOptions: state.uiState.availableOptionsStatusFilter
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setSelectedOptions: (value: string) => {
            dispatch(setSelectedOptionsStatusFilter(value));
        },
        resetFilter: () => {
            dispatch(resetStatusFilter());
        }
    }
};

export const ConnectedStatusFilter = connect(mapStateToProps, mapDispatchToProps, undefined as any, {forwardRef: true})(StatusFilter);