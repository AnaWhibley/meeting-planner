import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {useDispatch, useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../app/login/selectors';
import {editUserName, User} from '../../app/login/slice';
import defaultAvatar from '../../assets/images/default-avatar.png';
import './Profile.scss';
import {Switch, Typography} from '@material-ui/core';
import '../../styles/common.scss';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import {Color} from '../../styles/theme';
import {ReactComponent as EditIcon} from '../../assets/icons/evericons/pencil-edit.svg';
import {ReactComponent as BellIcon} from '../../assets/icons/evericons/bell.svg';
import TextInput from '../../components/textInput/TextInput';

export function Profile() {
    const loggedInUser: User | undefined = useSelector(selectLoggedInUser);

    const [showInputName, setShowInputName] = React.useState(false);
    const [name, setName] = React.useState(useSelector(selectLoggedInUser)?.name);

    const handleClick = () => {
        setShowInputName(true);
    };

    const handleConfirm = () => {
        setShowInputName(false);
        if(name) dispatch(editUserName(name));
    };
    const dispatch = useDispatch();

    return (
        <>
            <NavBar view={'Profile'}/>
            <div className={'ProfileContainer'}>
                <div className={'Wrapper'}>
                    <div className={'Data'}>
                        <div className={'UserImage'}><img src={defaultAvatar} alt="Imagen Usuario Defecto" className={'Image'}/></div>
                        <div className={'UserData'}>
                            <div>
                                <Typography variant={'h3'} color={'primary'} display={'inline'} className={'Bold'}>Nombre: </Typography>
                                {showInputName ? <TextInput type='text'
                                                            value={name}
                                                            placeholder={name}
                                                            className={'Input'}
                                                            onChange={(value: string) => setName(value)}/>
                                    :
                                    <Typography variant={'h3'} color={'textSecondary'} display={'inline'}>{loggedInUser?.name}</Typography>
                                }

                            </div>
                            <br/>
                            <div>
                                <Typography variant={'h3'} color={'primary'} display={'inline'} className={'Bold'}>Email: </Typography>
                                <Typography variant={'h3'} color={'textSecondary'} display={'inline'}>{loggedInUser?.id}</Typography>
                            </div>
                        </div>
                        <br/>
                    </div>
                    <div className={'Notifications'}>
                        <div className={'Text'}>
                            <BellIcon className={'FillPrimary'}/>
                            <Typography variant={'h3'} color={'primary'} display={'inline'} className={'Bold'}>Notificaciones</Typography>
                        </div>
                        <Switch disabled checked />
                    </div>
                    <div className={'Actions'}>
                        {showInputName ?
                            <ActionButton icon={<EditIcon className={'FillWhite'}/>}
                                          labelClassName={'EditLabel'}
                                          variant={ButtonVariant.CONTAINED}
                                          innerText={'Confirmar cambios'}
                                          color={Color.PRIMARY}
                                          onClick={handleConfirm}/>
                            :
                            <ActionButton icon={<EditIcon className={'FillPrimary'}/>}
                                          labelClassName={'EditLabel'}
                                          variant={ButtonVariant.OUTLINED}
                                          innerText={'Editar perfil'}
                                          color={Color.PRIMARY}
                                          onClick={handleClick}/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}