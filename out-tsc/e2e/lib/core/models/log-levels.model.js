"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevelsEnum = /** @class */ (function (_super) {
    __extends(LogLevelsEnum, _super);
    function LogLevelsEnum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogLevelsEnum.TRACE = 5;
    LogLevelsEnum.DEBUG = 4;
    LogLevelsEnum.INFO = 3;
    LogLevelsEnum.WARN = 2;
    LogLevelsEnum.ERROR = 1;
    LogLevelsEnum.SILENT = 0;
    return LogLevelsEnum;
}(Number));
exports.LogLevelsEnum = LogLevelsEnum;
exports.logLevels = [
    { level: LogLevelsEnum.TRACE, name: 'TRACE' },
    { level: LogLevelsEnum.DEBUG, name: 'DEBUG' },
    { level: LogLevelsEnum.INFO, name: 'INFO' },
    { level: LogLevelsEnum.WARN, name: 'WARN' },
    { level: LogLevelsEnum.ERROR, name: 'ERROR' },
    { level: LogLevelsEnum.SILENT, name: 'SILENT' }
];
//# sourceMappingURL=log-levels.model.js.map