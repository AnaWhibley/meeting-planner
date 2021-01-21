import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

interface User {
   name: string;
   role: string;
}

export interface LoginResponse {
    data?: User;
    success: boolean;
}

class UserService {
    public static login(username: string, password: string): Observable<LoginResponse> {
        if(username === 'a' && password === 'a') {
            return of({data: {name: 'a', role: 'admin'}, success: true}).pipe(delay(3000))
        }
        return of({success: false}).pipe(delay(3000))
    }
}

export default UserService;