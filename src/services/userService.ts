import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {User} from '../app/login/slice';
import {colors} from '../styles/theme';
import firebase from '../firebase-config';

interface UserDto {
   name: string;
   role?: Role;
   id: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface LoginResponse {
    user?: User;
    error?: string;
    success: boolean;
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
        id: 'admin@meetingplanner.es',
        name: 'José Daniel Hernández Sosa',
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

    public static login(email: string, password: string): Observable<LoginResponse> {

        return new Observable((subscriber) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((data) => {
                    const email = data.user?.email;
                    if(email) {
                        this.getUserById(email).subscribe((user) => {
                            subscriber.next({
                                user: {id: email, name: user.name},
                                success: true
                            })
                        });
                    }
                }).catch(function (error) {
                    const errorMessage = email.length === 0 || password.length === 0 ? getErrorMessage('auth/empty_login') : getErrorMessage(error.code);
                    subscriber.next({
                        error: errorMessage,
                        success: false
                    });
                    subscriber.complete();
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
                subscriber.complete();
            }).catch(function (error) {
                console.log('Error on logout - ', error);
                subscriber.next(false);
            });
        });
    }

    public static forgotPassword(email: string): Observable<boolean> {
        return new Observable((subscriber) => {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                subscriber.next(true);
                subscriber.complete();
            }).catch((error) => {
                console.log('Error on forgotPassword - ', error);
                subscriber.next(false);
            });
        });
    }

    public static getUserById(id: string): Observable<any> {
        return new Observable(subscriber => {
            firebase.firestore().collection('users').doc(id).get().then((document) => {
                if (!document.exists) return;
                subscriber.next(document.data());
                subscriber.complete();
            });
        });
    }

    public static getNameOfParticipants(userIds?: Array<string>): Observable<Array<User>> {
        if(!userIds){
            return of(users).pipe(delay(500),
                map((dto: Array<UserDto>) => dto.map((u, i) => ({...u, color: colors[i % colors.length]}))));
        }

        return of(users)
            .pipe(
                delay(500),
                map((dto: Array<UserDto>) => dto.filter(u => userIds.includes(u.id)).map((u, i) => ({...u, color: colors[i % colors.length]}))),
            );
    }

    public static editUserName(userId: string, newName: string): Observable<boolean>{
        return new Observable((subscriber) => {
            firebase.firestore().collection('users').doc(userId).update({name: newName})
                .then(() => {
                    subscriber.next(true);
                    subscriber.complete();
                })
                .catch((error) => {
                    console.error('Error updating user name: ', error);
                    subscriber.next(false);
                    subscriber.complete();
                });

        });
    }
}

export class MockUserService {

    public static login(email: string, password: string): Observable<LoginResponse> {
        if(email === 'a' && password === 'a') {
            return of({
                user: {name: 'José Daniel Hernández Sosa', role: Role.USER, id: 'daniel.hernandez@ulpgc.es'},
                success: true
            }).pipe(delay(1000))
        }else{
            return of(
                {
                    user: {name: 'José Daniel Hernández Sosa', role: Role.ADMIN, id: 'admin@meetingplanner.es'},
                    success: true
                }).pipe(delay(1000))
        }
    }

    public static logout() {
        return of(true).pipe(delay(1000));
    }

    public static getNameOfParticipants(userIds?: Array<string>): Observable<Array<User>> {
        if(!userIds){
            return of(users).pipe(delay(500),
                map((dto: Array<UserDto>) => dto.map((u, i) => ({...u, color: colors[i % colors.length]}))));
        }

        return of(users)
            .pipe(
                delay(500),
                map((dto: Array<UserDto>) => dto.filter(u => userIds.includes(u.id)).map((u, i) => ({...u, color: colors[i % colors.length]}))),
            );
    }

    public static editUserName(userId: string, newName: string): Observable<boolean>{
        return of(true).pipe(delay(500))
    }

    public static forgotPassword(email: string): Observable<boolean> {
        return of(true).pipe(delay(1000));
    }
}
