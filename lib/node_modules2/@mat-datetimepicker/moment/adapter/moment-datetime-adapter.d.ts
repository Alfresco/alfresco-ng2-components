import { DateAdapter } from "@angular/material";
import { DatetimeAdapter } from "@mat-datetimepicker/core";
import { Moment } from "moment";
export declare class MomentDatetimeAdapter extends DatetimeAdapter<Moment> {
    private _localeData;
    constructor(matDateLocale: string, _delegate: DateAdapter<Moment>);
    setLocale(locale: string): void;
    getHour(date: Moment): number;
    getMinute(date: Moment): number;
    isInNextMonth(startDate: Moment, endDate: Moment): boolean;
    createDatetime(year: number, month: number, date: number, hour: number, minute: number): Moment;
    private getDateInNextMonth(date);
    getFirstDateOfMonth(date: Moment): Moment;
    getHourNames(): string[];
    getMinuteNames(): string[];
    addCalendarHours(date: Moment, hours: number): Moment;
    addCalendarMinutes(date: Moment, minutes: number): Moment;
    deserialize(value: any): Moment | null;
}
