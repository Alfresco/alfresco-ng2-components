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

import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { LogLevelsEnum, logLevels } from '../models/log-levels.model';


@Injectable()
export class LogService {

    currentLogLevel: LogLevelsEnum = LogLevelsEnum.TRACE;

    constructor(appConfig: AppConfigService) {
        let configLevel: string = appConfig.get<string>('loglevel');

        if (configLevel) {
            this.currentLogLevel = this.getCurrentLogLevel(configLevel);
        }
    }

    get error(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel >= LogLevelsEnum.ERROR) {
            return console.error.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };
    }

    get info(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel >= LogLevelsEnum.INFO) {
            return console.info.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };
    }

    get log(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel >= LogLevelsEnum.ERROR) {
            return console.log.bind(console);
        }

        return (message?: any, ...optionalParams: any[]) => {
        };
    }

    get trace(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel >= LogLevelsEnum.TRACE) {
            return console.log.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };

    }

    get warn(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel >= LogLevelsEnum.WARN) {
            return console.warn.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };

    }

    get assert(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            return console.assert.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };

    }

    get group(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            return console.group.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };

    }

    get groupEnd(): (message?: any, ...optionalParams: any[]) => any {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            return console.groupEnd.bind(console);
        }
        return (message?: any, ...optionalParams: any[]) => {
        };

    }

    getCurrentLogLevel(level: string): LogLevelsEnum {
        return logLevels.find((currentLevel: LogLevelsEnum) => {
            return Object.keys(currentLevel)[0].toLocaleLowerCase() === level.toLocaleLowerCase();
        });
    }
}

export class LogServiceMock {

    assert(message?: any, ...optionalParams: any[]) {
    }

    error(message?: any, ...optionalParams: any[]) {
    }

    group(message?: any, ...optionalParams: any[]) {
    }

    groupEnd(message?: any, ...optionalParams: any[]) {
    }

    info(message?: any, ...optionalParams: any[]) {
    }

    log(message?: any, ...optionalParams: any[]) {
    }

    warn(message?: any, ...optionalParams: any[]) {
    }

}
