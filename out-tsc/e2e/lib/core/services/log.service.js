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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
var core_1 = require("@angular/core");
var app_config_service_1 = require("../app-config/app-config.service");
var log_levels_model_1 = require("../models/log-levels.model");
var rxjs_1 = require("rxjs");
var LogService = /** @class */ (function () {
    function LogService(appConfig) {
        this.appConfig = appConfig;
        this.onMessage = new rxjs_1.Subject();
    }
    Object.defineProperty(LogService.prototype, "currentLogLevel", {
        get: function () {
            var configLevel = this.appConfig.get(app_config_service_1.AppConfigValues.LOG_LEVEL);
            if (configLevel) {
                return this.getLogLevel(configLevel);
            }
            return log_levels_model_1.LogLevelsEnum.TRACE;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Logs a message at the "ERROR" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.ERROR) {
            this.messageBus(message, 'ERROR');
            console.error.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message at the "DEBUG" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.DEBUG) {
            this.messageBus(message, 'DEBUG');
            console.debug.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message at the "INFO" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.INFO) {
            this.messageBus(message, 'INFO');
            console.info.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message at any level from "TRACE" upwards.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.TRACE) {
            this.messageBus(message, 'LOG');
            console.log.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message at the "TRACE" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.trace = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.TRACE) {
            this.messageBus(message, 'TRACE');
            console.trace.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message at the "WARN" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel >= log_levels_model_1.LogLevelsEnum.WARN) {
            this.messageBus(message, 'WARN');
            console.warn.apply(console, [message].concat(optionalParams));
        }
    };
    /**
     * Logs a message if a boolean test fails.
     * @param test Test value (typically a boolean expression)
     * @param message Message to show if test is false
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    LogService.prototype.assert = function (test, message) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        if (this.currentLogLevel !== log_levels_model_1.LogLevelsEnum.SILENT) {
            this.messageBus(message, 'ASSERT');
            console.assert.apply(console, [test, message].concat(optionalParams));
        }
    };
    /**
     * Starts an indented group of log messages.
     * @param groupTitle Title shown at the start of the group
     * @param optionalParams Interpolation values for the title in "printf" format
     */
    LogService.prototype.group = function (groupTitle) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.currentLogLevel !== log_levels_model_1.LogLevelsEnum.SILENT) {
            console.group.apply(console, [groupTitle].concat(optionalParams));
        }
    };
    /**
     * Ends a indented group of log messages.
     */
    LogService.prototype.groupEnd = function () {
        if (this.currentLogLevel !== log_levels_model_1.LogLevelsEnum.SILENT) {
            console.groupEnd();
        }
    };
    /**
     * Converts a log level name string into its numeric equivalent.
     * @param level Level name
     * @returns Numeric log level
     */
    LogService.prototype.getLogLevel = function (level) {
        var referencedLevel = log_levels_model_1.logLevels.find(function (currentLevel) {
            return currentLevel.name.toLocaleLowerCase() === level.toLocaleLowerCase();
        });
        return referencedLevel ? referencedLevel.level : 5;
    };
    /**
     * Triggers notification callback for log messages.
     * @param text Message text
     * @param logLevel Log level for the message
     */
    LogService.prototype.messageBus = function (text, logLevel) {
        this.onMessage.next({ text: text, type: logLevel });
    };
    LogService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
    ], LogService);
    return LogService;
}());
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map