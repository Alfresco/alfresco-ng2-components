"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var widget_component_1 = require("./../widget.component");
var UploadWidgetComponent = (function (_super) {
    __extends(UploadWidgetComponent, _super);
    function UploadWidgetComponent(formService, logService, thumbnailService, processContentService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.logService = logService;
        _this.thumbnailService = thumbnailService;
        _this.processContentService = processContentService;
        _this.multipleOption = '';
        return _this;
    }
    UploadWidgetComponent.prototype.ngOnInit = function () {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
        }
        this.getMultipleFileParam();
    };
    UploadWidgetComponent.prototype.removeFile = function (file) {
        if (this.field) {
            this.removeElementFromList(file);
        }
    };
    UploadWidgetComponent.prototype.onFileChanged = function (event) {
        var _this = this;
        var files = event.target.files;
        var filesSaved = [];
        if (this.field.json.value) {
            filesSaved = this.field.json.value.slice();
        }
        if (files && files.length > 0) {
            Rx_1.Observable.from(files).flatMap(function (file) { return _this.uploadRawContent(file); }).subscribe(function (res) {
                filesSaved.push(res);
            }, function (error) {
                _this.logService.error('Error uploading file. See console output for more details.');
            }, function () {
                _this.field.value = filesSaved;
                _this.field.json.value = filesSaved;
            });
            this.hasFile = true;
        }
    };
    UploadWidgetComponent.prototype.uploadRawContent = function (file) {
        var _this = this;
        return this.processContentService.createTemporaryRawRelatedContent(file)
            .map(function (response) {
            _this.logService.info(response);
            return response;
        });
    };
    UploadWidgetComponent.prototype.getMultipleFileParam = function () {
        if (this.field &&
            this.field.params &&
            this.field.params.multiple) {
            this.multipleOption = this.field.params.multiple ? 'multiple' : '';
        }
    };
    UploadWidgetComponent.prototype.removeElementFromList = function (file) {
        var index = this.field.value.indexOf(file);
        if (index !== -1) {
            this.field.value.splice(index, 1);
            this.field.json.value = this.field.value;
            this.field.updateForm();
        }
        this.hasFile = this.field.value.length > 0;
        this.resetFormValueWithNoFiles();
    };
    UploadWidgetComponent.prototype.resetFormValueWithNoFiles = function () {
        if (this.field.value.length === 0) {
            this.field.value = [];
            this.field.json.value = [];
        }
    };
    UploadWidgetComponent.prototype.getIcon = function (mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    };
    UploadWidgetComponent.prototype.fileClicked = function (file) {
        var _this = this;
        this.processContentService.getFileRawContent(file.id).subscribe(function (blob) {
            file.contentBlob = blob;
            _this.formService.formContentClicked.next(file);
        }, function (error) {
            _this.logService.error('Unable to send evento for file ' + file.name);
        });
    };
    __decorate([
        core_1.ViewChild('uploadFiles')
    ], UploadWidgetComponent.prototype, "fileInput", void 0);
    UploadWidgetComponent = __decorate([
        core_1.Component({
            selector: 'upload-widget',
            templateUrl: './upload.widget.html',
            styleUrls: ['./upload.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], UploadWidgetComponent);
    return UploadWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.UploadWidgetComponent = UploadWidgetComponent;
