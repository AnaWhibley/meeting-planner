import React from 'react';
import nodata from '../../assets/icons/undraw/undraw_no_data.svg';
import './NoDataPage.scss';
import {Typography} from '@material-ui/core';

interface NoDataPageProps {
    message: string
}

export function NoDataPage(props: NoDataPageProps){

    const {message} = props;
    return (
        <div className={'NoDataPageContainer'}>
            <img src={nodata} alt="Ilustración 'Taken' de 'unDraw'"/>
            <Typography variant={'h2'} color={'primary'} className={'Message'}>{message}</Typography>
        </div>
    )
}