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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var file_model_1 = require("../models/file.model");
var UploadService = (function () {
    function UploadService(apiService) {
        var _this = this;
        this.apiService = apiService;
        this.formFields = {};
        this.queue = [];
        this.versioning = false;
        this.totalCompleted = 0;
        this.filesUpload$ = new Observable_1.Observable(function (observer) { return _this.filesUploadObserverProgressBar = observer; }).share();
        this.totalCompleted$ = new Observable_1.Observable(function (observer) { return _this.totalCompletedObserver = observer; }).share();
    }
    UploadService.prototype.setOptions = function (options, versioning) {
        this.formFields = options.formFields != null ? options.formFields : this.formFields;
        this.versioning = versioning != null ? versioning : this.versioning;
    };
    UploadService.prototype.addToQueue = function (files) {
        var latestFilesAdded = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (this.isFile(file)) {
                var uploadingFileModel = new file_model_1.FileModel(file);
                latestFilesAdded.push(uploadingFileModel);
                this.queue.push(uploadingFileModel);
                if (this.filesUploadObserverProgressBar) {
                    this.filesUploadObserverProgressBar.next(this.queue);
                }
            }
        }
        return latestFilesAdded;
    };
    UploadService.prototype.uploadFilesInTheQueue = function (rootId, directory, elementEmit) {
        var _this = this;
        var filesToUpload = this.queue.filter(function (uploadingFileModel) {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });
        var opts = {};
        opts.renditions = 'doclib';
        if (this.versioning) {
            opts.overwrite = true;
            opts.majorVersion = true;
        }
        else {
            opts.autoRename = true;
        }
        filesToUpload.forEach(function (uploadingFileModel) {
            uploadingFileModel.setUploading();
            var promiseUpload = _this.apiService.getInstance().upload.uploadFile(uploadingFileModel.file, directory, rootId, null, opts)
                .on('progress', function (progress) {
                uploadingFileModel.setProgres(progress);
                _this.updateFileListStream(_this.queue);
            })
                .on('abort', function () {
                uploadingFileModel.setAbort();
                elementEmit.emit({
                    value: 'File aborted'
                });
            })
                .on('error', function () {
                uploadingFileModel.setError();
                elementEmit.emit({
                    value: 'Error file uploaded'
                });
            })
                .on('success', function (data) {
                elementEmit.emit({
                    value: data
                });
                uploadingFileModel.onFinished(data.status, data.statusText, data.response);
                _this.updateFileListStream(_this.queue);
                if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                    _this.updateFileCounterStream(++_this.totalCompleted);
                }
            });
            uploadingFileModel.setPromiseUpload(promiseUpload);
        });
    };
    UploadService.prototype.getQueue = function () {
        return this.queue;
    };
    UploadService.prototype.isFile = function (file) {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    };
    UploadService.prototype.createFolder = function (relativePath, name) {
        return Observable_1.Observable.fromPromise(this.callApiCreateFolder(relativePath, name))
            .map(function (res) {
            return res;
        })
            .do(function (data) { return console.log('Node data', data); })
            .catch(this.handleError);
    };
    UploadService.prototype.callApiCreateFolder = function (relativePath, name) {
        return this.apiService.getInstance().nodes.createFolder(name, relativePath);
    };
    UploadService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error || 'Server error');
    };
    UploadService.prototype.updateFileListStream = function (fileList) {
        if (this.filesUploadObserverProgressBar) {
            this.filesUploadObserverProgressBar.next(fileList);
        }
    };
    UploadService.prototype.updateFileCounterStream = function (total) {
        if (this.totalCompletedObserver) {
            this.totalCompletedObserver.next(total);
        }
    };
    return UploadService;
}());
UploadService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoApiService])
], UploadService);
exports.UploadService = UploadService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3VwbG9hZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFFekQsOENBQTZDO0FBRTdDLHVEQUF1RDtBQUN2RCxtREFBaUQ7QUFTakQsSUFBYSxhQUFhO0lBZXRCLHVCQUFvQixVQUE4QjtRQUFsRCxpQkFHQztRQUhtQixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQWIxQyxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBRXhCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFLN0IsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFNOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHVCQUFVLENBQWMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsOEJBQThCLEdBQUcsUUFBUSxFQUE5QyxDQUE4QyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEgsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHVCQUFVLENBQVMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLEdBQUcsUUFBUSxFQUF0QyxDQUFzQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUcsQ0FBQztJQVNNLGtDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxVQUFtQjtRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNwRixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxJQUFJLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDeEUsQ0FBQztJQVNELGtDQUFVLEdBQVYsVUFBVyxLQUFZO1FBQ25CLElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxHQUFHLENB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bUIsR0FBM0IsVUFBNEIsWUFBb0IsRUFBRSxJQUFZO1FBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFPTyxtQ0FBVyxHQUFuQixVQUFvQixLQUFlO1FBRy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU8sNENBQW9CLEdBQTVCLFVBQTZCLFFBQXFCO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0wsQ0FBQztJQUVPLCtDQUF1QixHQUEvQixVQUFnQyxLQUFhO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0wsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0EzS0EsQUEyS0MsSUFBQTtBQTNLWSxhQUFhO0lBRHpCLGlCQUFVLEVBQUU7cUNBZ0J1QixzQ0FBa0I7R0FmekMsYUFBYSxDQTJLekI7QUEzS1ksc0NBQWEiLCJmaWxlIjoic2VydmljZXMvdXBsb2FkLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmVyIH0gZnJvbSAncnhqcy9PYnNlcnZlcic7XG5pbXBvcnQgeyBBbGZyZXNjb0FwaVNlcnZpY2UgfSBmcm9tICduZzItYWxmcmVzY28tY29yZSc7XG5pbXBvcnQgeyBGaWxlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvZmlsZS5tb2RlbCc7XG5cbi8qKlxuICpcbiAqIFVwbG9hZFNlcnZpY2Uga2VlcCB0aGUgcXVldWUgb2YgdGhlIGZpbGUgdG8gdXBsb2FkIGFuZCB1cGxvYWRzIHRoZW0uXG4gKlxuICogQHJldHVybnMge1VwbG9hZFNlcnZpY2V9IC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFVwbG9hZFNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBmb3JtRmllbGRzOiBPYmplY3QgPSB7fTtcbiAgICBwcml2YXRlIHF1ZXVlOiBGaWxlTW9kZWxbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSB2ZXJzaW9uaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGZpbGVzVXBsb2FkT2JzZXJ2ZXJQcm9ncmVzc0JhcjogT2JzZXJ2ZXI8RmlsZU1vZGVsW10+O1xuICAgIHByaXZhdGUgdG90YWxDb21wbGV0ZWRPYnNlcnZlcjogT2JzZXJ2ZXI8bnVtYmVyPjtcblxuICAgIHB1YmxpYyB0b3RhbENvbXBsZXRlZDogbnVtYmVyID0gMDtcblxuICAgIGZpbGVzVXBsb2FkJDogT2JzZXJ2YWJsZTxGaWxlTW9kZWxbXT47XG4gICAgdG90YWxDb21wbGV0ZWQkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkge1xuICAgICAgICB0aGlzLmZpbGVzVXBsb2FkJCA9IG5ldyBPYnNlcnZhYmxlPEZpbGVNb2RlbFtdPihvYnNlcnZlciA9PiB0aGlzLmZpbGVzVXBsb2FkT2JzZXJ2ZXJQcm9ncmVzc0JhciA9IG9ic2VydmVyKS5zaGFyZSgpO1xuICAgICAgICB0aGlzLnRvdGFsQ29tcGxldGVkJCA9IG5ldyBPYnNlcnZhYmxlPG51bWJlcj4ob2JzZXJ2ZXIgPT4gdGhpcy50b3RhbENvbXBsZXRlZE9ic2VydmVyID0gb2JzZXJ2ZXIpLnNoYXJlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlIHRoZSBzZXJ2aWNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gLSBvcHRpb25zIGZvcm1GaWVsZHMgdG8gaW5pdCB0aGUgb2JqZWN0XG4gICAgICogQHBhcmFtIHtib29sZWFufSAtIHZlcnNpb25pbmcgdHJ1ZSB0byBpbmRpY2F0ZSB0aGF0IGEgbWFqb3IgdmVyc2lvbiBzaG91bGQgYmUgY3JlYXRlZFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIHNldE9wdGlvbnMob3B0aW9uczogYW55LCB2ZXJzaW9uaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9ybUZpZWxkcyA9IG9wdGlvbnMuZm9ybUZpZWxkcyAhPSBudWxsID8gb3B0aW9ucy5mb3JtRmllbGRzIDogdGhpcy5mb3JtRmllbGRzO1xuICAgICAgICB0aGlzLnZlcnNpb25pbmcgPSB2ZXJzaW9uaW5nICE9IG51bGwgPyB2ZXJzaW9uaW5nIDogdGhpcy52ZXJzaW9uaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBmaWxlcyB0byB0aGUgdXBsb2FkaW5nIHF1ZXVlIHRvIGJlIHVwbG9hZGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGaWxlW119IC0gZmlsZXMgdG8gYWRkIHRvIHRoZSB1cGxvYWQgcXVldWUuXG4gICAgICpcbiAgICAgKiByZXR1cm4ge0ZpbGVNb2RlbFtdfSAtIHJldHVybiB0aGUgZmlsZSBhZGRlZCB0byB0aGUgcXVldWUgaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGFkZFRvUXVldWUoZmlsZXM6IGFueVtdKTogRmlsZU1vZGVsW10ge1xuICAgICAgICBsZXQgbGF0ZXN0RmlsZXNBZGRlZDogRmlsZU1vZGVsW10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpbGUoZmlsZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXBsb2FkaW5nRmlsZU1vZGVsID0gbmV3IEZpbGVNb2RlbChmaWxlKTtcbiAgICAgICAgICAgICAgICBsYXRlc3RGaWxlc0FkZGVkLnB1c2godXBsb2FkaW5nRmlsZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2godXBsb2FkaW5nRmlsZU1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlc1VwbG9hZE9ic2VydmVyUHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxlc1VwbG9hZE9ic2VydmVyUHJvZ3Jlc3NCYXIubmV4dCh0aGlzLnF1ZXVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhdGVzdEZpbGVzQWRkZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGljayBhbGwgdGhlIGZpbGVzIGluIHRoZSBxdWV1ZSB0aGF0IGFyZSBub3QgYmVlbiB1cGxvYWRlZCB5ZXQgYW5kIHVwbG9hZCBpdCBpbnRvIHRoZSBkaXJlY3RvcnkgZm9sZGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyB1cGxvYWRGaWxlc0luVGhlUXVldWUocm9vdElkOiBzdHJpbmcsIGRpcmVjdG9yeTogc3RyaW5nLCBlbGVtZW50RW1pdDogRXZlbnRFbWl0dGVyPGFueT4pOiB2b2lkIHtcbiAgICAgICAgbGV0IGZpbGVzVG9VcGxvYWQgPSB0aGlzLnF1ZXVlLmZpbHRlcigodXBsb2FkaW5nRmlsZU1vZGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXVwbG9hZGluZ0ZpbGVNb2RlbC51cGxvYWRpbmcgJiYgIXVwbG9hZGluZ0ZpbGVNb2RlbC5kb25lICYmICF1cGxvYWRpbmdGaWxlTW9kZWwuYWJvcnQgJiYgIXVwbG9hZGluZ0ZpbGVNb2RlbC5lcnJvcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IG9wdHM6IGFueSA9IHt9O1xuICAgICAgICBvcHRzLnJlbmRpdGlvbnMgPSAnZG9jbGliJztcblxuICAgICAgICBpZiAodGhpcy52ZXJzaW9uaW5nKSB7XG4gICAgICAgICAgICBvcHRzLm92ZXJ3cml0ZSA9IHRydWU7XG4gICAgICAgICAgICBvcHRzLm1ham9yVmVyc2lvbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRzLmF1dG9SZW5hbWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsZXNUb1VwbG9hZC5mb3JFYWNoKCh1cGxvYWRpbmdGaWxlTW9kZWw6IEZpbGVNb2RlbCkgPT4ge1xuICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLnNldFVwbG9hZGluZygpO1xuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZVVwbG9hZCA9IHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLnVwbG9hZC51cGxvYWRGaWxlKHVwbG9hZGluZ0ZpbGVNb2RlbC5maWxlLCBkaXJlY3RvcnksIHJvb3RJZCwgbnVsbCwgb3B0cylcbiAgICAgICAgICAgICAgICAub24oJ3Byb2dyZXNzJywgKHByb2dyZXNzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLnNldFByb2dyZXMocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGVMaXN0U3RyZWFtKHRoaXMucXVldWUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdhYm9ydCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLnNldEFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRFbWl0LmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdGaWxlIGFib3J0ZWQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLnNldEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRFbWl0LmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdFcnJvciBmaWxlIHVwbG9hZGVkJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbignc3VjY2VzcycsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudEVtaXQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLm9uRmluaXNoZWQoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGVMaXN0U3RyZWFtKHRoaXMucXVldWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXVwbG9hZGluZ0ZpbGVNb2RlbC5hYm9ydCAmJiAhdXBsb2FkaW5nRmlsZU1vZGVsLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGVDb3VudGVyU3RyZWFtKCsrdGhpcy50b3RhbENvbXBsZXRlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLnNldFByb21pc2VVcGxvYWQocHJvbWlzZVVwbG9hZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbGwgdGhlIGZpbGVzIGluIHRoZSB1cGxvYWRpbmcgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGaWxlTW9kZWxbXX0gLSBmaWxlcyBpbiB0aGUgdXBsb2FkIHF1ZXVlLlxuICAgICAqL1xuICAgIGdldFF1ZXVlKCk6IEZpbGVNb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYW4gaXRlbSBpcyBhIGZpbGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgaXNGaWxlKGZpbGU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmlsZSAhPT0gbnVsbCAmJiAoZmlsZSBpbnN0YW5jZW9mIEJsb2IgfHwgKGZpbGUubmFtZSAmJiBmaWxlLnNpemUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBmb2xkZXJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBmb2xkZXIgbmFtZVxuICAgICAqL1xuICAgIGNyZWF0ZUZvbGRlcihyZWxhdGl2ZVBhdGg6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKHRoaXMuY2FsbEFwaUNyZWF0ZUZvbGRlcihyZWxhdGl2ZVBhdGgsIG5hbWUpKVxuICAgICAgICAgICAgLm1hcChyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvKGRhdGEgPT4gY29uc29sZS5sb2coJ05vZGUgZGF0YScsIGRhdGEpKSAvLyBleWViYWxsIHJlc3VsdHMgaW4gdGhlIGNvbnNvbGVcbiAgICAgICAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGxBcGlDcmVhdGVGb2xkZXIocmVsYXRpdmVQYXRoOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkubm9kZXMuY3JlYXRlRm9sZGVyKG5hbWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3cgdGhlIGVycm9yXG4gICAgICogQHBhcmFtIGVycm9yXG4gICAgICogQHJldHVybnMge0Vycm9yT2JzZXJ2YWJsZX1cbiAgICAgKi9cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBSZXNwb25zZSkge1xuICAgICAgICAvLyBpbiBhIHJlYWwgd29ybGQgYXBwLCB3ZSBtYXkgc2VuZCB0aGUgZXJyb3IgdG8gc29tZSByZW1vdGUgbG9nZ2luZyBpbmZyYXN0cnVjdHVyZVxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGp1c3QgbG9nZ2luZyBpdCB0byB0aGUgY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IgfHwgJ1NlcnZlciBlcnJvcicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRmlsZUxpc3RTdHJlYW0oZmlsZUxpc3Q6IEZpbGVNb2RlbFtdKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbGVzVXBsb2FkT2JzZXJ2ZXJQcm9ncmVzc0Jhcikge1xuICAgICAgICAgICAgdGhpcy5maWxlc1VwbG9hZE9ic2VydmVyUHJvZ3Jlc3NCYXIubmV4dChmaWxlTGlzdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUZpbGVDb3VudGVyU3RyZWFtKHRvdGFsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMudG90YWxDb21wbGV0ZWRPYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy50b3RhbENvbXBsZXRlZE9ic2VydmVyLm5leHQodG90YWwpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
