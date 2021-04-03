import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {User} from '../app/login/slice';
import {colors} from '../styles/theme';
import firebase from '../firebase-config';
import {ServiceResponse} from './utils';

interface UserDto {
    name: string;
    role?: Role;
    id: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

const users: Array<UserDto> = [
    {
        id: 'abraham.rodriguez@ulpgc.es',
        name: 'Abraham Rodríguez Rodríguez'
    },
    {
        id: 'alexis.quesada@ulpgc.es',
        name: 'Alexis Quesada Arencibia'
    },
    {
        id: 'daniel.hernandez@ulpgc.es',
        name: 'José Daniel Hernández Sosa'
    },
    {
        id: 'meetingplannertfg@gmail.com',
        name: 'Administración Meeting Planner',
        role: Role.ADMIN
    },
    {
        id: 'carmelo.cuenca@ulpgc.es',
        name: 'Carmelo Cuenca Hernández'
    },
    {
        id: 'eduardo.rodriguez@ulpgc.es',
        name: 'Eduardo Miguel Rodríguez Barrera'
    },
    {
        id: 'antonio.ocon@ulpgc.es',
        name: 'Antonio Ocón Carreras'
    },
    {
        id: 'octavio.mayor@ulpgc.es',
        name: 'Octavio Mayor González'
    },
    {
        id: 'francisco.alayon@ulpgc.es',
        name: 'Francisco Alayón Hernández'
    },
    {
        id: 'francisca.quintana@ulpgc.es',
        name: 'Francisca Quintana Domínguez'
    },
    {
        id: 'domingo.benitez@ulpgc.es',
        name: 'Domingo Benítez Díaz'
    },
    {
        id: 'jc.rodriguezdelpino@ulpgc.es',
        name: 'Juan Carlos Rodríguez del Pino'
    },
    {
        id: 'david.freire@ulpgc.es',
        name: 'David Sebastián Freire Obregón'
    }
];

export class UserService {

    public static login(email: string, password: string): Observable<ServiceResponse<User>> {

        return new Observable((subscriber) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((data) => {
                    const email = data.user?.email;
                    if(email) {
                        this.getUserById(email).subscribe((response) => {
                            subscriber.next(response);
                        });
                    }
                }).catch(function (error) {
                const errorMessage = email.length === 0 || password.length === 0 ? getErrorMessage('auth/empty_login') : getErrorMessage(error.code);
                subscriber.next({
                    data: {name: '', id: ''},
                    error: errorMessage,
                    success: false
                });
            });
        })

        function getErrorMessage(errorCode: string) {
            let errorMessage;
            switch (errorCode) {
                case 'auth/empty_login': {
                    errorMessage = 'El email y la contraseña son campos requeridos';
                    break;
                }
                case 'auth/wrong-password': {
                    errorMessage = 'El email o la contraseña no es válido/a';
                    break;
                }
                case 'auth/invalid-email': {
                    errorMessage = 'El email no tiene un formato válido';
                    break;
                }
                case 'auth/user-not-found': {
                    errorMessage = 'No hemos encontrado un usuario con ese email y contraseña';
                    break;
                }
                default: {
                    errorMessage = 'Ocurrió un error al intentar iniciar sesión'
                    break;
                }
            }
            return errorMessage;
        }
    }

    public static logout(): Observable<boolean> {
        return new Observable((subscriber) => {
            firebase.auth().signOut().then(() => {
                subscriber.next(true);
            }).catch(function (error) {
                subscriber.next(false);
            });
        });
    }

    public static forgotPassword(email: string): Observable<boolean> {
        return new Observable((subscriber) => {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                subscriber.next(true);
            }).catch((error) => {
                subscriber.next(false);
            });
        });
    }

    public static getUserById(id: string): Observable<ServiceResponse<User>> {
        return new Observable(subscriber => {
            firebase.firestore().collection('users').doc(id).get().then((document) => {
                if (!document.exists) {
                    subscriber.next({
                        success: false,
                        error: 'User does not exist',
                        data: {name: '', id: ''}
                    });
                }else{
                    const user = {
                        id,
                        name: document.data()?.name,
                        role: document.data()?.role === 'admin' ? Role.ADMIN : Role.USER
                    };
                    subscriber.next({
                        success: true,
                        data: user
                    });
                }
            });
        });
    }

    public static getParticipants(userIds?: Array<string>): Observable<ServiceResponse<Array<User>>> {

        return new Observable((subscriber) => {
            firebase.firestore().collection('users').onSnapshot((snapshot) => {
                const users = snapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    color: colors[index % colors.length],
                    name: doc.data().name
                }));
                if(userIds){
                    const data = users.filter(u => userIds.includes(u.id));
                    subscriber.next({
                        success: true,
                        data
                    });
                }else{
                    subscriber.next({
                        success: true,
                        data: users
                    });
                }
            }, (error) => {
                subscriber.next({
                    success: false,
                    error: 'Error collecting users: ' + error,
                    data: []
                });
            });
        });
    }

    public static editUserName(userId: string, newName: string): Observable<boolean>{
        return new Observable((subscriber) => {
            firebase.firestore().collection('users').doc(userId).update({
                name: newName
            }).then(() => {
                subscriber.next(true);
            }).catch((error) => {
                subscriber.next(false);
            });
        });
    }
}

export class MockUserService {

    public static login(email: string, password: string): Observable<ServiceResponse<User>> {
        if(email === 'daniel.hernandez@ulpgc.es' && password === 'anaTFG') {
            return of({
                data: {name: 'José Daniel Hernández Sosa', role: Role.USER, id: 'daniel.hernandez@ulpgc.es'},
                success: true
            }).pipe(delay(1000))
        }else{
            return of(
                {
                    data: {name: 'Administración Meeting Planner', role: Role.ADMIN, id: 'meetingplannertfg@gmail.com'},
                    success: true
                }).pipe(delay(1000))
        }
    }

    public static logout() {
        return of(true).pipe(delay(1000));
    }

    public static getParticipants(userIds?: Array<string>): Observable<ServiceResponse<Array<User>>> {
        if(!userIds){
            return of(users).pipe(
                delay(500),
                map((dto: Array<UserDto>) => dto.map((u, i) => ({...u, color: colors[i % colors.length]}))),
                map(dto => ({success: true, data: dto}))
            );
        }

        return of(users)
            .pipe(
                delay(500),
                map((dto: Array<UserDto>) => dto.filter(u => userIds.includes(u.id)).map((u, i) => ({...u, color: colors[i % colors.length]}))),
                map(dto => ({success: true, data: dto}))
            );
    }

    public static editUserName(userId: string, newName: string): Observable<boolean>{
        return of(true).pipe(delay(500))
    }

    public static forgotPassword(email: string): Observable<boolean> {
        return of(true).pipe(delay(1000));
    }
}
