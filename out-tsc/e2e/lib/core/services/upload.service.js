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
var minimatch_browser_1 = require("minimatch-browser");
var rxjs_1 = require("rxjs");
var app_config_service_1 = require("../app-config/app-config.service");
var file_event_1 = require("../events/file.event");
var file_model_1 = require("../models/file.model");
var alfresco_api_service_1 = require("./alfresco-api.service");
var UploadService = /** @class */ (function () {
    function UploadService(apiService, appConfigService) {
        this.apiService = apiService;
        this.appConfigService = appConfigService;
        this.cache = {};
        this.totalComplete = 0;
        this.totalAborted = 0;
        this.totalError = 0;
        this.excludedFileList = [];
        this.matchingOptions = null;
        this.activeTask = null;
        this.queue = [];
        this.queueChanged = new rxjs_1.Subject();
        this.fileUpload = new rxjs_1.Subject();
        this.fileUploadStarting = new rxjs_1.Subject();
        this.fileUploadCancelled = new rxjs_1.Subject();
        this.fileUploadProgress = new rxjs_1.Subject();
        this.fileUploadAborted = new rxjs_1.Subject();
        this.fileUploadError = new rxjs_1.Subject();
        this.fileUploadComplete = new rxjs_1.Subject();
        this.fileUploadDeleted = new rxjs_1.Subject();
        this.fileDeleted = new rxjs_1.Subject();
    }
    /**
     * Checks whether the service is uploading a file.
     * @returns True if a file is uploading, false otherwise
     */
    UploadService.prototype.isUploading = function () {
        return this.activeTask ? true : false;
    };
    /**
     * Gets the file Queue
     * @returns Array of files that form the queue
     */
    UploadService.prototype.getQueue = function () {
        return this.queue;
    };
    /**
     * Adds files to the uploading queue to be uploaded
     * @param files One or more separate parameters or an array of files to queue
     * @returns Array of files that were not blocked from upload by the ignore list
     */
    UploadService.prototype.addToQueue = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        var allowedFiles = files.filter(function (currentFile) { return _this.filterElement(currentFile); });
        this.queue = this.queue.concat(allowedFiles);
        this.queueChanged.next(this.queue);
        return allowedFiles;
    };
    UploadService.prototype.filterElement = function (file) {
        var _this = this;
        var isAllowed = true;
        this.excludedFileList = this.appConfigService.get('files.excluded');
        if (this.excludedFileList) {
            this.matchingOptions = this.appConfigService.get('files.match-options');
            isAllowed = this.excludedFileList.filter(function (pattern) {
                var minimatch = new minimatch_browser_1.Minimatch(pattern, _this.matchingOptions);
                return minimatch.match(file.name);
            }).length === 0;
        }
        return isAllowed;
    };
    /**
     * Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
     * @param emitter Emitter to invoke on file status change
     */
    UploadService.prototype.uploadFilesInTheQueue = function (emitter) {
        var _this = this;
        if (!this.activeTask) {
            var file = this.queue.find(function (currentFile) { return currentFile.status === file_model_1.FileUploadStatus.Pending; });
            if (file) {
                this.onUploadStarting(file);
                var promise = this.beginUpload(file, emitter);
                this.activeTask = promise;
                this.cache[file.id] = promise;
                var next_1 = function () {
                    _this.activeTask = null;
                    setTimeout(function () { return _this.uploadFilesInTheQueue(emitter); }, 100);
                };
                promise.next = next_1;
                promise.then(function () { return next_1(); }, function () { return next_1(); });
            }
        }
    };
    /**
     * Cancels uploading of files.
     * @param files One or more separate parameters or an array of files specifying uploads to cancel
     */
    UploadService.prototype.cancelUpload = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        files.forEach(function (file) {
            var promise = _this.cache[file.id];
            if (promise) {
                promise.abort();
                delete _this.cache[file.id];
            }
            else {
                var performAction = _this.getAction(file);
                performAction();
            }
        });
    };
    /** Clears the upload queue */
    UploadService.prototype.clearQueue = function () {
        this.queue = [];
        this.totalComplete = 0;
        this.totalAborted = 0;
        this.totalError = 0;
    };
    /**
     * Gets an upload promise for a file.
     * @param file The target file
     * @returns Promise that is resolved if the upload is successful or error otherwise
     */
    UploadService.prototype.getUploadPromise = function (file) {
        var opts = {
            renditions: 'doclib',
            include: ['allowableOperations']
        };
        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = file.options.majorVersion;
            opts.comment = file.options.comment;
            opts.name = file.name;
        }
        else {
            opts.autoRename = true;
        }
        if (file.options.nodeType) {
            opts.nodeType = file.options.nodeType;
        }
        if (file.id) {
            return this.apiService.getInstance().node.updateNodeContent(file.id, file.file, opts);
        }
        else {
            return this.apiService.getInstance().upload.uploadFile(file.file, file.options.path, file.options.parentId, file.options, opts);
        }
    };
    UploadService.prototype.beginUpload = function (file, emitter) {
        var _this = this;
        var promise = this.getUploadPromise(file);
        promise.on('progress', function (progress) {
            _this.onUploadProgress(file, progress);
        })
            .on('abort', function () {
            _this.onUploadAborted(file);
            if (emitter) {
                emitter.emit({ value: 'File aborted' });
            }
        })
            .on('error', function (err) {
            _this.onUploadError(file, err);
            if (emitter) {
                emitter.emit({ value: 'Error file uploaded' });
            }
        })
            .on('success', function (data) {
            _this.onUploadComplete(file, data);
            if (emitter) {
                emitter.emit({ value: data });
            }
        })
            .catch(function (err) {
        });
        return promise;
    };
    UploadService.prototype.onUploadStarting = function (file) {
        if (file) {
            file.status = file_model_1.FileUploadStatus.Starting;
            var event_1 = new file_event_1.FileUploadEvent(file, file_model_1.FileUploadStatus.Starting);
            this.fileUpload.next(event_1);
            this.fileUploadStarting.next(event_1);
        }
    };
    UploadService.prototype.onUploadProgress = function (file, progress) {
        if (file) {
            file.progress = progress;
            file.status = file_model_1.FileUploadStatus.Progress;
            var event_2 = new file_event_1.FileUploadEvent(file, file_model_1.FileUploadStatus.Progress);
            this.fileUpload.next(event_2);
            this.fileUploadProgress.next(event_2);
        }
    };
    UploadService.prototype.onUploadError = function (file, error) {
        if (file) {
            file.errorCode = (error || {}).status;
            file.status = file_model_1.FileUploadStatus.Error;
            this.totalError++;
            var promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }
            var event_3 = new file_event_1.FileUploadErrorEvent(file, error, this.totalError);
            this.fileUpload.next(event_3);
            this.fileUploadError.next(event_3);
        }
    };
    UploadService.prototype.onUploadComplete = function (file, data) {
        if (file) {
            file.status = file_model_1.FileUploadStatus.Complete;
            file.data = data;
            this.totalComplete++;
            var promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }
            var event_4 = new file_event_1.FileUploadCompleteEvent(file, this.totalComplete, data, this.totalAborted);
            this.fileUpload.next(event_4);
            this.fileUploadComplete.next(event_4);
        }
    };
    UploadService.prototype.onUploadAborted = function (file) {
        if (file) {
            file.status = file_model_1.FileUploadStatus.Aborted;
            this.totalAborted++;
            var promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }
            var event_5 = new file_event_1.FileUploadEvent(file, file_model_1.FileUploadStatus.Aborted);
            this.fileUpload.next(event_5);
            this.fileUploadAborted.next(event_5);
            promise.next();
        }
    };
    UploadService.prototype.onUploadCancelled = function (file) {
        if (file) {
            file.status = file_model_1.FileUploadStatus.Cancelled;
            var event_6 = new file_event_1.FileUploadEvent(file, file_model_1.FileUploadStatus.Cancelled);
            this.fileUpload.next(event_6);
            this.fileUploadCancelled.next(event_6);
        }
    };
    UploadService.prototype.onUploadDeleted = function (file) {
        if (file) {
            file.status = file_model_1.FileUploadStatus.Deleted;
            this.totalComplete--;
            var event_7 = new file_event_1.FileUploadDeleteEvent(file, this.totalComplete);
            this.fileUpload.next(event_7);
            this.fileUploadDeleted.next(event_7);
        }
    };
    UploadService.prototype.getAction = function (file) {
        var _this = this;
        var _a;
        var actions = (_a = {},
            _a[file_model_1.FileUploadStatus.Pending] = function () { return _this.onUploadCancelled(file); },
            _a[file_model_1.FileUploadStatus.Deleted] = function () { return _this.onUploadDeleted(file); },
            _a[file_model_1.FileUploadStatus.Error] = function () { return _this.onUploadError(file, null); },
            _a);
        return actions[file.status];
    };
    UploadService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService, app_config_service_1.AppConfigService])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map