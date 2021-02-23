import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {User} from '../app/login/slice';

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
    success: boolean;
}

const users: Array<UserDto> = [
    {
        id: 'abraham.rodriguez@ulpgc.es',
        name: 'Abraham Rodríaguez Rodríguez'
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
        id: 'jc.rodriguezdelpino@ulpgc.ess',
        name: 'Juan Carlos Rodríguez del Pino'
    },
    {
        id: 'david.freire@ulpgc.es',
        name: 'David Sebastián Freire Obregón'
    }
];

class UserService {
    public static login(username: string, password: string): Observable<LoginResponse> {
        if(username === 'a' && password === 'a') {
            return of(
                {
                    user: {name: 'José Daniel Hernández Sosa', role: Role.ADMIN, id: 'admin@meetingplanner.es'},
                    success: true
                }).pipe(delay(1000))
        }else{
            return of({
                user: {name: 'José Daniel Hernández Sosa', role: Role.USER, id: 'daniel.hernandez@ulpgc.es'},
                success: true
            }).pipe(delay(1000))
        }
        //return of({success: false}).pipe(delay(1000))
    }

    public static getUsers(): Observable<Array<User>>{
        return of(users).pipe(delay(1000))
    }

    public static getNameOfParticipants(userIds?: Array<string>): Observable<Array<User>> {
        if(!userIds){
            return of(users).pipe(delay(1000));
        }

        return of(users)
            .pipe(
                delay(1000),
                map((dto: Array<UserDto>) => dto.filter(u => userIds.includes(u.id))),
                );
    }
}

export default UserService;