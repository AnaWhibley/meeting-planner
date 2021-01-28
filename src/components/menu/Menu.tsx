import React from 'react';
import Button from '@material-ui/core/Button';
import MaterialMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {ListItemIcon, Typography} from '@material-ui/core';
import {ReactComponent as MenuIcon} from '../../assets/icons/menu.svg';
import './Menu.scss';

interface MenuProps {
    menuItems: Array<{label: string, icon: JSX.Element, onClick: () => void}>
}

export default function Menu(props: MenuProps) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (menuOnClick: () => void) => {
        handleClose();
        menuOnClick();
    }
    const menuItems = props.menuItems.map(definition => {
        return <MenuItem key={definition.label}
                         onClick={() => handleMenuItemClick(definition.onClick)}>
            <ListItemIcon>
                {definition.icon}
            </ListItemIcon>
            <Typography variant="body2" color={'textPrimary'}>{definition.label}</Typography>
        </MenuItem>;
    });
    return (
        <div>
            <Button onClick={handleClick}>
                <MenuIcon className={'MenuIcon'}/>
            </Button>
            <MaterialMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {menuItems}
            </MaterialMenu>
        </div>
    );
}
