/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { browser } from 'protractor';

const infoColor = '\x1b[36m%s\x1b[0m',
    logColor = '\x1b[35m%s\x1b[0m',
    warnColor = '\x1b[33m%s\x1b[0m',
    errorColor = '\x1b[31m%s\x1b[0m';

export class LogLevelsEnum extends Number {
    static TRACE: number = 5;
    static DEBUG: number = 4;
    static INFO: number = 3;
    static WARN: number = 2;
    static ERROR: number = 1;
    static SILENT: number = 0;
}

export let logLevels: any[] = [
    { level: LogLevelsEnum.TRACE, name: 'TRACE' },
    { level: LogLevelsEnum.DEBUG, name: 'DEBUG' },
    { level: LogLevelsEnum.INFO, name: 'INFO' },
    { level: LogLevelsEnum.WARN, name: 'WARN' },
    { level: LogLevelsEnum.ERROR, name: 'ERROR' },
    { level: LogLevelsEnum.SILENT, name: 'SILENT' }
];

/* tslint:disable:no-console */
export class Logger {
    static info(...messages: string[]): void {
        if (browser.params.testConfig && Logger.getLogLevelByName(browser.params.testConfig.appConfig.log) >= LogLevelsEnum.INFO) {
            console.log(infoColor, messages.join(''));
        }
    }

    static log(...messages: string[]): void {
        if (browser.params.testConfig && Logger.getLogLevelByName(browser.params.testConfig.appConfig.log) >= LogLevelsEnum.TRACE) {
            console.log(logColor, messages.join(''));
        }
    }

    static warn(...messages: string[]): void {
        if (browser.params.testConfig && Logger.getLogLevelByName(browser.params.testConfig.appConfig.log) >= LogLevelsEnum.WARN) {
            console.log(warnColor, messages.join(''));
        }
    }

    static error(...messages: string[]): void {
        console.log(errorColor, messages.join(''));
    }

    private static getLogLevelByName(name: string): number {
        const log = logLevels.find((currentLog) => {
            return currentLog.name === name;
        });

        return log.level || 1;
    }
}
