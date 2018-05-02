import { AfterContentInit, EventEmitter } from "@angular/core";
import { MatDatetimepickerCalendarCell } from "./calendar-body";
import { MatDatetimeFormats } from "../adapter/datetime-formats";
import { DatetimeAdapter } from "../adapter/datetime-adapter";
/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerYearView<D> implements AfterContentInit {
    _adapter: DatetimeAdapter<D>;
    private _dateFormats;
    _userSelection: EventEmitter<void>;
    type: "date" | "time" | "month" | "datetime";
    /** The date to display in this year view (everything other than the year is ignored). */
    activeDate: D;
    private _activeDate;
    /** The currently selected date. */
    selected: D;
    private _selected;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when a new month is selected. */
    selectedChange: EventEmitter<D>;
    /** Grid of calendar cells representing the months of the year. */
    _months: MatDatetimepickerCalendarCell[][];
    /** The label for this year (e.g. "2017"). */
    _yearLabel: string;
    /** The month in this year that today falls on. Null if today is in a different year. */
    _todayMonth: number;
    /**
     * The month in this year that the selected Date falls on.
     * Null if the selected Date is in a different year.
     */
    _selectedMonth: number;
    _calendarState: string;
    constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MatDatetimeFormats);
    ngAfterContentInit(): void;
    /** Handles when a new month is selected. */
    _monthSelected(month: number): void;
    /** Initializes this month view. */
    private _init();
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    private _getMonthInCurrentYear(date);
    /** Creates an MdCalendarCell for the given month. */
    private _createCellForMonth(month, monthName);
    /** Whether the given month is enabled. */
    private _isMonthEnabled(month);
    _calendarStateDone(): void;
}
