/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/* tslint:disable:no-console  */

import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { logLevels, LogLevelsEnum } from '../models/log-levels.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LogService {

    currentLogLevel: LogLevelsEnum = LogLevelsEnum.TRACE;

    onMessage: Subject<any>;

    constructor(appConfig: AppConfigService) {

        this.onMessage = new Subject();

        if (appConfig) {
            let configLevel: string = appConfig.get<string>('logLevel');

            if (configLevel) {
                this.currentLogLevel = this.getCurrentLogLevel(configLevel);
            }
        }
    }

    error(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.ERROR) {

            this.messageBus(message, 'ERROR');

            console.error(message, ...optionalParams);
        }
    }

    debug(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.DEBUG) {

            this.messageBus(message, 'DEBUG');

            console.debug(message, ...optionalParams);
        }
    }

    info(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.INFO) {

            this.messageBus(message, 'INFO');

            console.info(message, ...optionalParams);
        }
    }

    log(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

            this.messageBus(message, 'LOG');

            console.log(message, ...optionalParams);
        }
    }

    trace(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

            this.messageBus(message, 'TRACE');

            console.trace(message, ...optionalParams);
        }
    }

    warn(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.WARN) {

            this.messageBus(message, 'WARN');

            console.warn(message, ...optionalParams);
        }
    }

    assert(test?: boolean, message?: string, ...optionalParams: any[]) {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {

            this.messageBus(message, 'ASSERT');

            console.assert(test, message, ...optionalParams);
        }
    }

    group(groupTitle?: string, ...optionalParams: any[]) {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            console.group(groupTitle, ...optionalParams);
        }
    }

    groupEnd() {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            console.groupEnd();
        }
    }

    getCurrentLogLevel(level: string): LogLevelsEnum {
        let referencedLevel = logLevels.find((currentLevel: any) => {
            return currentLevel.name.toLocaleLowerCase() === level.toLocaleLowerCase();
        });

        return referencedLevel ? referencedLevel.level : 5;
    }

    messageBus(text: string, logLevel: string) {
        this.onMessage.next({ text: text, type: logLevel });
    }
}
