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
var core_1 = require("@angular/core");
var translation_service_1 = require("../services/translation.service");
var FileSizePipe = /** @class */ (function () {
    function FileSizePipe(translation) {
        this.translation = translation;
    }
    FileSizePipe.prototype.transform = function (bytes, decimals) {
        if (decimals === void 0) { decimals = 2; }
        if (bytes == null || bytes === undefined) {
            return '';
        }
        if (bytes === 0) {
            return '0 ' + this.translation.instant('CORE.FILE_SIZE.BYTES');
        }
        var k = 1024, dm = decimals || 2, sizes = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
        var i18nSize = this.translation.instant("CORE.FILE_SIZE." + sizes[i]);
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + i18nSize;
    };
    FileSizePipe = __decorate([
        core_1.Pipe({
            name: 'adfFileSize',
            pure: false
        }),
        __metadata("design:paramtypes", [translation_service_1.TranslationService])
    ], FileSizePipe);
    return FileSizePipe;
}());
exports.FileSizePipe = FileSizePipe;
//# sourceMappingURL=file-size.pipe.js.map