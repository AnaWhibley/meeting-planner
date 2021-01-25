import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

export interface User {
   name: string;
   role: Role;
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface LoginResponse {
    data?: User;
    success: boolean;
}

class UserService {
    public static login(username: string, password: string): Observable<LoginResponse> {
        if(username === 'a' && password === 'a') {
            return of({data: {name: 'a', role: Role.USER}, success: true}).pipe(delay(3000))
        }
        return of({success: false}).pipe(delay(3100))
    }
}

export default UserService;