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

@Injectable()
export class LogService {

    get assert(): (message?: any, ...optionalParams: any[]) => void {
        return console.assert.bind(console);
    }

    get error(): (message?: any, ...optionalParams: any[]) => void {
        return console.error.bind(console);
    }

    get group(): (message?: any, ...optionalParams: any[]) => void {
        return console.group.bind(console);
    }

    get groupEnd(): (message?: any, ...optionalParams: any[]) => void {
        return console.groupEnd.bind(console);
    }

    get info(): (message?: any, ...optionalParams: any[]) => void {
        return console.info.bind(console);
    }

    get log(): (message?: any, ...optionalParams: any[]) => void {
        return console.log.bind(console);
    }

    get warn(): (message?: any, ...optionalParams: any[]) => void {
        return console.warn.bind(console);
    }

}

export class LogServiceMock {

    assert(message?: any, ...optionalParams: any[]) {}
    error(message?: any, ...optionalParams: any[]) {}
    group(message?: any, ...optionalParams: any[]) {}
    groupEnd(message?: any, ...optionalParams: any[]) {}
    info(message?: any, ...optionalParams: any[]) {}
    log(message?: any, ...optionalParams: any[]) {}
    warn(message?: any, ...optionalParams: any[]) {}

}
