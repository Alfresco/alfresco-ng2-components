/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export const infoColor = '\x1b[36m%s\x1b[0m';
export const logColor = '\x1b[35m%s\x1b[0m';
export const warnColor = '\x1b[33m%s\x1b[0m';
export const errorColor = '\x1b[31m%s\x1b[0m';

export type LOG_LEVEL = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

export class LogLevelsEnum extends Number {
    static TRACE: number = 5;
    static DEBUG: number = 4;
    static INFO: number = 3;
    static WARN: number = 2;
    static ERROR: number = 1;
    static SILENT: number = 0;
}

export const logLevels: { level: LogLevelsEnum; name: LOG_LEVEL }[] = [
    { level: LogLevelsEnum.TRACE, name: 'TRACE' },
    { level: LogLevelsEnum.DEBUG, name: 'DEBUG' },
    { level: LogLevelsEnum.INFO, name: 'INFO' },
    { level: LogLevelsEnum.WARN, name: 'WARN' },
    { level: LogLevelsEnum.ERROR, name: 'ERROR' },
    { level: LogLevelsEnum.SILENT, name: 'SILENT' }
];

export interface LoggerLike {
    info(...messages: string[]): void;
    log(...messages: string[]): void;
    warn(...messages: string[]): void;
    error(...messages: string[]): void;
}

/* eslint-disable no-console */
export class GenericLogger implements LoggerLike {

    private level: LogLevelsEnum;

    constructor(logLevel: string) {
        this.level = logLevels.find(({name}) => name === logLevel)?.level || LogLevelsEnum.ERROR;
    }

    info(...messages: string[]): void {
        if (this.level >= LogLevelsEnum.INFO) {
            console.log(infoColor, messages.join(''));
        }
    }

    log(...messages: string[]): void {
        if (this.level >= LogLevelsEnum.TRACE) {
            console.log(logColor, messages.join(''));
        }
    }

    warn(...messages: string[]): void {
        if (this.level >= LogLevelsEnum.WARN) {
            console.log(warnColor, messages.join(''));
        }
    }

    error(...messages: string[]): void {
        console.log(errorColor, messages.join(''));
    }
}
