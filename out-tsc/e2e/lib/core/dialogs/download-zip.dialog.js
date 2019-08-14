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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var log_service_1 = require("../services/log.service");
var download_zip_service_1 = require("../services/download-zip.service");
var DownloadZipDialogComponent = /** @class */ (function () {
    function DownloadZipDialogComponent(dialogRef, data, logService, downloadZipService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.logService = logService;
        this.downloadZipService = downloadZipService;
        // flag for async threads
        this.cancelled = false;
    }
    DownloadZipDialogComponent.prototype.ngOnInit = function () {
        if (this.data && this.data.nodeIds && this.data.nodeIds.length > 0) {
            if (!this.cancelled) {
                this.downloadZip(this.data.nodeIds);
            }
            else {
                this.logService.log('Cancelled');
            }
        }
    };
    DownloadZipDialogComponent.prototype.cancelDownload = function () {
        this.cancelled = true;
        this.downloadZipService.cancelDownload(this.downloadId);
        this.dialogRef.close(false);
    };
    DownloadZipDialogComponent.prototype.downloadZip = function (nodeIds) {
        var _this = this;
        if (nodeIds && nodeIds.length > 0) {
            this.downloadZipService.createDownload({ nodeIds: nodeIds }).subscribe(function (data) {
                if (data && data.entry && data.entry.id) {
                    var url_1 = _this.downloadZipService.getContentUrl(data.entry.id, true);
                    _this.downloadZipService.getNode(data.entry.id).subscribe(function (downloadNode) {
                        _this.logService.log(downloadNode);
                        var fileName = downloadNode.entry.name;
                        _this.downloadId = data.entry.id;
                        _this.waitAndDownload(data.entry.id, url_1, fileName);
                    });
                }
            });
        }
    };
    DownloadZipDialogComponent.prototype.waitAndDownload = function (downloadId, url, fileName) {
        var _this = this;
        if (this.cancelled) {
            return;
        }
        this.downloadZipService.getDownload(downloadId).subscribe(function (downloadEntry) {
            if (downloadEntry.entry) {
                if (downloadEntry.entry.status === 'DONE') {
                    _this.download(url, fileName);
                }
                else {
                    setTimeout(function () {
                        _this.waitAndDownload(downloadId, url, fileName);
                    }, 1000);
                }
            }
        });
    };
    DownloadZipDialogComponent.prototype.download = function (url, fileName) {
        if (url && fileName) {
            var link = document.createElement('a');
            link.style.display = 'none';
            link.download = fileName;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        this.dialogRef.close(true);
    };
    DownloadZipDialogComponent = __decorate([
        core_1.Component({
            selector: 'adf-download-zip-dialog',
            templateUrl: './download-zip.dialog.html',
            styleUrls: ['./download-zip.dialog.scss'],
            host: { 'class': 'adf-download-zip-dialog' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, log_service_1.LogService,
            download_zip_service_1.DownloadZipService])
    ], DownloadZipDialogComponent);
    return DownloadZipDialogComponent;
}());
exports.DownloadZipDialogComponent = DownloadZipDialogComponent;
//# sourceMappingURL=download-zip.dialog.js.map