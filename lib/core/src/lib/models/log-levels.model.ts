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

export class LogLevelsEnum extends Number {
    static TRACE: number = 5;
    static DEBUG: number = 4;
    static INFO: number = 3;
    static WARN: number = 2;
    static ERROR: number = 1;
    static SILENT: number = 0;
}

export let logLevels: any[] = [
    {level: LogLevelsEnum.TRACE, name: 'TRACE'},
    {level: LogLevelsEnum.DEBUG, name: 'DEBUG'},
    {level: LogLevelsEnum.INFO, name: 'INFO'},
    {level: LogLevelsEnum.WARN, name: 'WARN'},
    {level: LogLevelsEnum.ERROR, name: 'ERROR'},
    {level: LogLevelsEnum.SILENT, name: 'SILENT'}
];
