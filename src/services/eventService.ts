import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

export interface CreateResponse {
    success: boolean;
}

class EventService {

    private static events: any = [];
    public static create(events: Array<any>): Observable<CreateResponse> {
        this.events = events;
        console.log("1!!", events)
        return of({success: true}).pipe(delay(1000))
    }
}

export default EventService;