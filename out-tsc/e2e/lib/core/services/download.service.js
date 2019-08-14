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
var DownloadService = /** @class */ (function () {
    function DownloadService() {
        this.saveData = (function () {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            return function (fileData, format, fileName) {
                var blob = null;
                if (format === 'blob' || format === 'data') {
                    blob = new Blob([fileData], { type: 'octet/stream' });
                }
                if (format === 'object' || format === 'json') {
                    var json = JSON.stringify(fileData);
                    blob = new Blob([json], { type: 'octet/stream' });
                }
                if (blob) {
                    if (typeof window.navigator !== 'undefined' &&
                        window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveOrOpenBlob(blob, fileName);
                    }
                    else {
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }
            };
        })();
    }
    /**
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    DownloadService.prototype.downloadBlob = function (blob, fileName) {
        this.saveData(blob, 'blob', fileName);
    };
    /**
     * Invokes content download for a data array with a file name.
     * @param data Data to download.
     * @param fileName Name of the resulting file.
     */
    DownloadService.prototype.downloadData = function (data, fileName) {
        this.saveData(data, 'data', fileName);
    };
    /**
     * Invokes content download for a JSON object with a file name.
     * @param json JSON object to download.
     * @param fileName Name of the resulting file.
     */
    DownloadService.prototype.downloadJSON = function (json, fileName) {
        this.saveData(json, 'json', fileName);
    };
    DownloadService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], DownloadService);
    return DownloadService;
}());
exports.DownloadService = DownloadService;
//# sourceMappingURL=download.service.js.map