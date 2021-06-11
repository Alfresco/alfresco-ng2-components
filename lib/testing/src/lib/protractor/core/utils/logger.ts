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

import { infoColor, logColor, warnColor, errorColor, logLevels, LogLevelsEnum } from '../../../shared/logger';
import { browser } from 'protractor';

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

    private static getLogLevelByName(name: string): LogLevelsEnum {
        if (name) {
            const log = logLevels.find((currentLog) => {
                return currentLog.name === name;
            });

            if (log && log.level) {
                return log.level;
            } else {
                console.error(errorColor, 'Log level not correctly set, use one of the following values TRACE|DEBUG|INFO|WARN|ERROR|SILENT');
                return LogLevelsEnum.ERROR;
            }
        } else {
            return LogLevelsEnum.ERROR;
        }
    }
}
