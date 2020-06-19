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

/* tslint:disable:no-console */
export class Logger {
    static info(...messages: string[]): void {
        if (browser.params.config && browser.params.config.log) {
            console.log(infoColor, messages.join(''));
        }
    }

    static log(...messages: string[]): void {
        if (browser.params.config && browser.params.config.log) {
            console.log(logColor, messages.join(''));
        }
    }

    static warn(...messages: string[]): void {
        if (browser.params.config && browser.params.config.log) {
            console.log(warnColor, messages.join(''));
        }
    }

    static error(...messages: string[]): void {
        console.log(errorColor, messages.join(''));
    }
}
