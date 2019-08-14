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
/* tslint:disable:component-selector  */
var log_service_1 = require("../../../../services/log.service");
var thumbnail_service_1 = require("../../../../services/thumbnail.service");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var form_service_1 = require("../../../services/form.service");
var process_content_service_1 = require("../../../services/process-content.service");
var content_link_model_1 = require("../core/content-link.model");
var widget_component_1 = require("./../widget.component");
var operators_1 = require("rxjs/operators");
var UploadWidgetComponent = /** @class */ (function (_super) {
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
            rxjs_1.from(files)
                .pipe(operators_1.mergeMap(function (file) { return _this.uploadRawContent(file); }))
                .subscribe(function (res) { return filesSaved.push(res); }, function () { return _this.logService.error('Error uploading file. See console output for more details.'); }, function () {
                _this.field.value = filesSaved;
                _this.field.json.value = filesSaved;
                _this.hasFile = true;
            });
        }
    };
    UploadWidgetComponent.prototype.uploadRawContent = function (file) {
        var _this = this;
        return this.processContentService.createTemporaryRawRelatedContent(file)
            .pipe(operators_1.map(function (response) {
            _this.logService.info(response);
            response.contentBlob = file;
            return response;
        }));
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
    UploadWidgetComponent.prototype.fileClicked = function (contentLinkModel) {
        var _this = this;
        var file = new content_link_model_1.ContentLinkModel(contentLinkModel);
        var fetch = this.processContentService.getContentPreview(file.id);
        if (file.isTypeImage() || file.isTypePdf()) {
            fetch = this.processContentService.getFileRawContent(file.id);
        }
        fetch.subscribe(function (blob) {
            file.contentBlob = blob;
            _this.formService.formContentClicked.next(file);
        }, function () {
            _this.logService.error('Unable to send event for file ' + file.name);
        });
    };
    __decorate([
        core_1.ViewChild('uploadFiles'),
        __metadata("design:type", core_1.ElementRef)
    ], UploadWidgetComponent.prototype, "fileInput", void 0);
    UploadWidgetComponent = __decorate([
        core_1.Component({
            selector: 'upload-widget',
            templateUrl: './upload.widget.html',
            styleUrls: ['./upload.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService,
            log_service_1.LogService,
            thumbnail_service_1.ThumbnailService,
            process_content_service_1.ProcessContentService])
    ], UploadWidgetComponent);
    return UploadWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.UploadWidgetComponent = UploadWidgetComponent;
//# sourceMappingURL=upload.widget.js.map