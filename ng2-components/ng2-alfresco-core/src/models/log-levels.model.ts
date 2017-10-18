export class LogLevelsEnum extends Number {
    static TRACE: number = 5;
    static DEBUG: number = 4;
    static INFO: number = 3;
    static WARN: number = 2;
    static ERROR: number = 1;
    static SILENT: number = 0;
}

export let logLevels: LogLevelsEnum[] = [
    LogLevelsEnum.TRACE, LogLevelsEnum.DEBUG, LogLevelsEnum.INFO,
    LogLevelsEnum.WARN, LogLevelsEnum.ERROR, LogLevelsEnum.SILENT
];
