import { AfterContentInit, EventEmitter } from "@angular/core";
import { MatDatetimeFormats } from "../adapter/datetime-formats";
import { DatetimeAdapter } from "../adapter/datetime-adapter";
import { MatDatetimepickerCalendarCell } from "./calendar-body";
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerMonthView<D> implements AfterContentInit {
    _adapter: DatetimeAdapter<D>;
    private _dateFormats;
    type: "date" | "time" | "month" | "datetime";
    _userSelection: EventEmitter<void>;
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    activeDate: D;
    private _activeDate;
    /** The currently selected date. */
    selected: D;
    private _selected;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when a new date is selected. */
    selectedChange: EventEmitter<D>;
    /** Grid of calendar cells representing the dates of the month. */
    _weeks: MatDatetimepickerCalendarCell[][];
    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;
    /**
     * The date of the month that the currently selected Date falls on.
     * Null if the currently selected Date is in another month.
     */
    _selectedDate: number;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number;
    /** The names of the weekdays. */
    _weekdays: {
        long: string;
        narrow: string;
    }[];
    _calendarState: string;
    constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MatDatetimeFormats);
    ngAfterContentInit(): void;
    /** Handles when a new date is selected. */
    _dateSelected(date: number): void;
    /** Initializes this month view. */
    private _init();
    /** Creates MdCalendarCells for the dates in this month. */
    private _createWeekCells();
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth(date);
    private calendarState(direction);
    _calendarStateDone(): void;
}
