import {BusyDateDto, BusyDto, EventDto} from "../services/eventService";

declare global {
    namespace jest {
        export interface Matchers<R> {
            toHaveBusyDates(userId: string, start: string, end: string, eventId?: string): R;
            toHaveNBusyDates(userId: string, n: number): R;
            toHaveStatus(status: string, eventId: string): R;
            toBusyDatesBeEqual(busyDates: Array<BusyDateDto>): R;
        }
    }
}

expect.extend({
        toHaveBusyDates(result, userId, start, end, eventId) {

            const busyDate: BusyDateDto = result.busyDates.find((x: BusyDateDto) => x.userId === userId);
            expect(busyDate).toBeDefined();

            let pass;
            if(eventId) {
                pass = this.equals(busyDate.busy, expect.arrayContaining([
                    expect.objectContaining({start, end, eventId})]))
            }else{
                pass = this.equals(busyDate.busy, expect.arrayContaining([
                    expect.objectContaining({start, end})]))
            }

            if(pass){
                return {
                    message: () => (`Expected busyDates ${this.utils.printReceived(result.busyDates)} from ${userId} 
                    not to contain ${this.utils.printExpected({start, end, eventId})}`),
                    pass: true
                }
            }else{
                return {
                    message: () => (`Expected busyDates ${this.utils.printReceived(result.busyDates)} from ${userId} 
                    to contain ${this.utils.printExpected({start, end, eventId})}`),
                    pass: false
                }
            }
        }
    }
);

expect.extend({
        toHaveNBusyDates(received, userId, n) {

            const busyDate: BusyDateDto = received.busyDates.find((x: BusyDateDto) => x.userId === userId);
            expect(busyDate).toBeDefined();

            return (busyDate.busy.length === n) ? ({
                pass: true,
                message: () => `Expected ${userId} not to have ${n} unavailabilities`
            }) : ({
                pass: false,
                message: () => `Expected ${userId} to have ${n} unavailabilities`
            });
        }
    }
);

expect.extend({
        toHaveStatus(received, status, eventId) {

            const event: EventDto = received.events.find((event: EventDto) => event.id === eventId);
            expect(event).toBeDefined();

            return (event.status === status) ? ({
                pass: true,
                message: () => `Expected ${eventId} not to have status:${status}`
            }) : ({
                pass: false,
                message: () => `Expected ${eventId} to have status:${status}`
            });
        }
    }
);

expect.extend({
        toBusyDatesBeEqual(searchBusyDates, resultBusyDates) {

            const searchBusyDatesMap = new Map();
            searchBusyDates.forEach((busyDate: BusyDateDto) => {
                searchBusyDatesMap.set(busyDate.userId, busyDate.busy);
            });

            const resultBusyDatesMap = new Map();
            resultBusyDates.forEach((busyDate: BusyDateDto) => {
                resultBusyDatesMap.set(busyDate.userId, busyDate.busy);
            });

            if(searchBusyDatesMap.size !== resultBusyDatesMap.size) {
                return ({
                    pass: false,
                    message: () => `Expected search busy dates to have ${resultBusyDatesMap.size} elements`
                })
            }

            for(let entry of resultBusyDatesMap) {
                if(searchBusyDatesMap.has(entry[0])) {
                    const searchBusyArray = resultBusyDatesMap.get(entry[0]);
                    const resultBusyArray = entry[1];
                    expect(resultBusyArray).toEqual(expect.arrayContaining(searchBusyArray));
                }else{
                    return ({
                        pass: false,
                        message: () => `Expected search busy dates to have ${entry[0]} between its elements`
                    })
                }
            }

            return ({
                pass: true,
                message: () => `Expected search busy dates to be equal to result busy dates`
            });
        }
    }
);
