import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface User {
   name: string;
   role?: Role;
   id: string; //email
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface LoginResponse {
    data?: User;
    success: boolean;
}

const users = [
    {
        id: '1',
        name: 'Eduardo Miguel Rodríguez Barrera'
    },
    {
        id: '2',
        name: 'Juan Carlos Quevedo Losada'
    },
    {
        id: '3',
        name: 'Alexis Quesada Arencibia'
    },
    {
        id: '4',
        name: 'Jose Daniel Hernández'
    },
    {
        id: '5',
        name: 'Gustavo Rodríguez Rodríguez'
    },
    {
        id: '6',
        name: 'Francisco Alayón Hernández'
    },
    {
        id: '7',
        name: 'Luis Doreste Blanco'
    },
    {
        id: '8',
        name: 'Julio Esclarín Monreal'
    },
    {
        id: '9',
        name: 'Ibai'
    },
    {
        id: '10',
        name: 'Auron'
    },
    {
        id: '11',
        name: 'Aurelio'
    },
    {
        id: '12',
        name: 'Rubén'
    }
];

class UserService {
    public static login(username: string, password: string): Observable<LoginResponse> {
        if(username === 'a' && password === 'a') {
            return of({data: {name: 'Jose Daniel', role: Role.ADMIN, id: '1000'}, success: true}).pipe(delay(1000))
        }else{
            return of({data: {name: 'Jose Daniel', role: Role.USER, id: '8'}, success: true}).pipe(delay(1000))
        }
        //return of({success: false}).pipe(delay(1000))
    }

    public static getUsers(): Observable<Array<User>>{
        return of(users).pipe(delay(1000))
    }
}

export default UserService;