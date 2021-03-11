import {BusyDateDto} from "../services/eventService";

declare global {
    namespace jest {
        export interface Matchers<R> {
            toHaveBusyDates(userId: string, start: string, end: string, eventId?: string): R;
            toHaveNBusyDates(userId: string, n: number): R;
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
                message: () => `Expected ${received} to have ${n} unavailabilities`
            });
        }
    }
);
