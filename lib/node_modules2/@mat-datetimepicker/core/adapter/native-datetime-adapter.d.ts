import { DateAdapter } from "@angular/material";
import { DatetimeAdapter } from "./datetime-adapter";
export declare class NativeDatetimeAdapter extends DatetimeAdapter<Date> {
    constructor(matDateLocale: string, _delegate: DateAdapter<Date>);
    clone(date: Date): Date;
    getHour(date: Date): number;
    getMinute(date: Date): number;
    isInNextMonth(startDate: Date, endDate: Date): boolean;
    createDatetime(year: number, month: number, date: number, hour: number, minute: number): Date;
    private getDateInNextMonth(date);
    getFirstDateOfMonth(date: Date): Date;
    getHourNames(): string[];
    getMinuteNames(): string[];
    addCalendarYears(date: Date, years: number): Date;
    addCalendarMonths(date: Date, months: number): Date;
    addCalendarDays(date: Date, days: number): Date;
    addCalendarHours(date: Date, hours: number): Date;
    addCalendarMinutes(date: Date, minutes: number): Date;
    toIso8601(date: Date): string;
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private _stripDirectionalityCharacters(str);
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    private _2digit(n);
    /** Creates a date but allows the month and date to overflow. */
    private _createDateWithOverflow(year, month, date, hours, minutes);
}
