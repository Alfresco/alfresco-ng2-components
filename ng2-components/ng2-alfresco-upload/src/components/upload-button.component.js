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
var upload_service_1 = require("../services/upload.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
require("rxjs/Rx");
var ERROR_FOLDER_ALREADY_EXIST = 409;
var UploadButtonComponent = UploadButtonComponent_1 = (function () {
    function UploadButtonComponent(el, _uploaderService, translate) {
        this.el = el;
        this._uploaderService = _uploaderService;
        this.showUdoNotificationBar = true;
        this.uploadFolders = false;
        this.multipleFiles = false;
        this.versioning = false;
        this.acceptedFilesType = '*';
        this.currentFolderPath = '/';
        this.rootFolderId = UploadButtonComponent_1.DEFAULT_ROOT_ID;
        this.onSuccess = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        this.createFolder = new core_1.EventEmitter();
        this.translate = translate;
        translate.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
    }
    UploadButtonComponent.prototype.ngOnChanges = function (changes) {
        var formFields = this.createFormFields();
        this._uploaderService.setOptions(formFields, this.versioning);
    };
    UploadButtonComponent.prototype.onFilesAdded = function ($event) {
        var files = $event.currentTarget.files;
        this.uploadFiles(this.currentFolderPath, files);
        $event.target.value = '';
    };
    UploadButtonComponent.prototype.onDirectoryAdded = function ($event) {
        var _this = this;
        var files = $event.currentTarget.files;
        var hashMapDir = this.convertIntoHashMap(files);
        hashMapDir.forEach(function (filesDir, directoryPath) {
            var directoryName = _this.getDirectoryName(directoryPath);
            var absolutePath = _this.currentFolderPath + _this.getDirectoryPath(directoryPath);
            _this._uploaderService.createFolder(absolutePath, directoryName)
                .subscribe(function (res) {
                var relativeDir = _this.currentFolderPath + '/' + directoryPath;
                _this.uploadFiles(relativeDir, filesDir);
            }, function (error) {
                var errorMessagePlaceholder = _this.getErrorMessage(error.response);
                if (errorMessagePlaceholder) {
                    _this.onError.emit({ value: errorMessagePlaceholder });
                    var errorMessage = _this.formatString(errorMessagePlaceholder, [directoryName]);
                    if (errorMessage) {
                        _this._showErrorNotificationBar(errorMessage);
                    }
                }
                console.log(error);
            });
        });
        $event.target.value = '';
    };
    UploadButtonComponent.prototype.uploadFiles = function (path, files) {
        if (files.length) {
            var latestFilesAdded = this._uploaderService.addToQueue(files);
            this._uploaderService.uploadFilesInTheQueue(this.rootFolderId, path, this.onSuccess);
            if (this.showUdoNotificationBar) {
                this._showUndoNotificationBar(latestFilesAdded);
            }
        }
    };
    UploadButtonComponent.prototype.convertIntoHashMap = function (files) {
        var directoryMap = new Map();
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var directory = this.getDirectoryPath(file.webkitRelativePath);
            var filesSomeDir = directoryMap.get(directory) || [];
            filesSomeDir.push(file);
            directoryMap.set(directory, filesSomeDir);
        }
        return directoryMap;
    };
    UploadButtonComponent.prototype.getDirectoryPath = function (directory) {
        var relativeDirPath = '';
        var dirPath = directory.split('/');
        if (dirPath.length > 1) {
            dirPath.pop();
            relativeDirPath = '/' + dirPath.join('/');
        }
        return relativeDirPath;
    };
    UploadButtonComponent.prototype.getDirectoryName = function (directory) {
        var dirPath = directory.split('/');
        if (dirPath.length > 1) {
            return dirPath.pop();
        }
        else {
            return dirPath[0];
        }
    };
    UploadButtonComponent.prototype._showUndoNotificationBar = function (latestFilesAdded) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
        var messageTranslate, actionTranslate;
        messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');
        if (this.undoNotificationBar.nativeElement.MaterialSnackbar) {
            this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                message: messageTranslate.value,
                timeout: 3000,
                actionHandler: function () {
                    latestFilesAdded.forEach(function (uploadingFileModel) {
                        uploadingFileModel.emitAbort();
                    });
                },
                actionText: actionTranslate.value
            });
        }
    };
    UploadButtonComponent.prototype.getErrorMessage = function (response) {
        if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            var errorMessage = void 0;
            errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    };
    UploadButtonComponent.prototype._showErrorNotificationBar = function (errorMessage) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
        if (this.undoNotificationBar.nativeElement.MaterialSnackbar) {
            this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                message: errorMessage,
                timeout: 3000
            });
        }
    };
    UploadButtonComponent.prototype.formatString = function (message, keys) {
        var i = keys.length;
        while (i--) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
        }
        return message;
    };
    UploadButtonComponent.prototype.createFormFields = function () {
        return {
            formFields: {
                overwrite: true
            }
        };
    };
    return UploadButtonComponent;
}());
UploadButtonComponent.DEFAULT_ROOT_ID = '-root-';
__decorate([
    core_1.ViewChild('undoNotificationBar'),
    __metadata("design:type", Object)
], UploadButtonComponent.prototype, "undoNotificationBar", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadButtonComponent.prototype, "showUdoNotificationBar", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadButtonComponent.prototype, "uploadFolders", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadButtonComponent.prototype, "multipleFiles", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadButtonComponent.prototype, "versioning", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UploadButtonComponent.prototype, "acceptedFilesType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UploadButtonComponent.prototype, "currentFolderPath", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UploadButtonComponent.prototype, "rootFolderId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UploadButtonComponent.prototype, "onSuccess", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UploadButtonComponent.prototype, "onError", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UploadButtonComponent.prototype, "createFolder", void 0);
UploadButtonComponent = UploadButtonComponent_1 = __decorate([
    core_1.Component({
        selector: 'alfresco-upload-button',
        moduleId: module.id,
        template: "<form>     <!--Files Upload-->     <div *ngIf=\"!uploadFolders\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-button--file\">         <i class=\"material-icons\">file_upload</i>          <!--Multiple Files Upload-->         <span *ngIf=\"multipleFiles\">             <label for=\"upload-multiple-files\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FILE' | translate}}</label>             <input id=\"upload-multiple-files\" data-automation-id=\"upload-multiple-files\" type=\"file\" name=\"uploadFiles\"                    (change)=\"onFilesAdded($event)\"                    multiple=\"multiple\"                    accept=\"{{acceptedFilesType}}\"                    #uploadFiles>         </span>          <!--Single Files Upload-->         <span *ngIf=\"!multipleFiles\">             <label for=\"upload-single-file\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FILE' | translate}}</label>             <input id=\"upload-single-file\" data-automation-id=\"upload-single-file\" type=\"file\" name=\"uploadFiles\"                    (change)=\"onFilesAdded($event)\"                    accept=\"{{acceptedFilesType}}\"                    #uploadFiles>         </span>     </div>      <!--Folders Upload-->     <div *ngIf=\"uploadFolders\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-button--file\">         <i class=\"material-icons\">file_upload</i>         <label for=\"uploadFolder\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FOLDER' | translate}}</label>         <input id=\"uploadFolder\" data-automation-id=\"uploadFolder\" type=\"file\" name=\"uploadFiles\"                (change)=\"onDirectoryAdded($event)\"                multiple=\"multiple\"                accept=\"{{acceptedFilesType}}\"                webkitdirectory directory                multiple #uploadFolders>     </div> </form>  <!--Notification bar--> <div id=\"undo-notification-bar\"  class=\"mdl-js-snackbar mdl-snackbar\"      #undoNotificationBar>     <div class=\"mdl-snackbar__text\"></div>     <button data-automation-id=\"undo_upload_button\" class=\"mdl-snackbar__action\" type=\"button\">{{'FILE_UPLOAD.ACTION.UNDO' | translate}}</button> </div>",
        styles: [".mdl-button--file input {     cursor: pointer;     height: 100%;     right: 0;     opacity: 0;     position: absolute;     top: 0;     width: 300px;     z-index: 4; }  .mdl-textfield--file .mdl-textfield__input {     box-sizing: border-box;     width: calc(100% - 32px); }  .mdl-textfield--file .mdl-button--file {     right: 0; }"]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, upload_service_1.UploadService, ng2_alfresco_core_1.AlfrescoTranslationService])
], UploadButtonComponent);
exports.UploadButtonComponent = UploadButtonComponent;
var UploadButtonComponent_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXBsb2FkLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUE4RjtBQUM5Riw2REFBMkQ7QUFFM0QsdURBQStEO0FBQy9ELG1CQUFpQjtBQUlqQixJQUFNLDBCQUEwQixHQUFHLEdBQUcsQ0FBQztBQTRCdkMsSUFBYSxxQkFBcUI7SUF1QzlCLCtCQUFtQixFQUFjLEVBQVUsZ0JBQStCLEVBQUUsU0FBcUM7UUFBOUYsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBZTtRQS9CMUUsMkJBQXNCLEdBQVksSUFBSSxDQUFDO1FBR3ZDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRy9CLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRy9CLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFHNUIsc0JBQWlCLEdBQVcsR0FBRyxDQUFDO1FBR2hDLHNCQUFpQixHQUFXLEdBQUcsQ0FBQztRQUdoQyxpQkFBWSxHQUFXLHVCQUFxQixDQUFDLGVBQWUsQ0FBQztRQUc3RCxjQUFTLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHL0IsWUFBTyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBRzdCLGlCQUFZLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFLOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsU0FBUyxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFLHNDQUFzQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELDJDQUFXLEdBQVgsVUFBWSxPQUFPO1FBQ2YsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7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Q3VCO0FBRy9CO0lBREMsWUFBSyxFQUFFOzt5REFDb0I7QUFHNUI7SUFEQyxZQUFLLEVBQUU7O2dFQUN3QjtBQUdoQztJQURDLFlBQUssRUFBRTs7Z0VBQ3dCO0FBR2hDO0lBREMsWUFBSyxFQUFFOzsyREFDcUQ7QUFHN0Q7SUFEQyxhQUFNLEVBQUU7O3dEQUNzQjtBQUcvQjtJQURDLGFBQU0sRUFBRTs7c0RBQ29CO0FBRzdCO0lBREMsYUFBTSxFQUFFOzsyREFDeUI7QUFuQ3pCLHFCQUFxQjtJQU5qQyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLHdCQUF3QjtRQUNsQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsUUFBUSxFQUFFLDJtRUFBMm1FO1FBQ3JuRSxNQUFNLEVBQUUsQ0FBQyw0VUFBNFUsQ0FBQztLQUN6VixDQUFDO3FDQXdDeUIsaUJBQVUsRUFBNEIsOEJBQWEsRUFBYSw4Q0FBMEI7R0F2Q3hHLHFCQUFxQixDQThPakM7QUE5T1ksc0RBQXFCIiwiZmlsZSI6ImNvbXBvbmVudHMvdXBsb2FkLWJ1dHRvbi5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBVcGxvYWRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdXBsb2FkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2ZpbGUubW9kZWwnO1xuaW1wb3J0IHsgQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICduZzItYWxmcmVzY28tY29yZSc7XG5pbXBvcnQgJ3J4anMvUngnO1xuXG5kZWNsYXJlIGxldCBjb21wb25lbnRIYW5kbGVyOiBhbnk7XG5cbmNvbnN0IEVSUk9SX0ZPTERFUl9BTFJFQURZX0VYSVNUID0gNDA5O1xuXG4vKipcbiAqIDxhbGZyZXNjby11cGxvYWQtYnV0dG9uIFtzaG93VWRvTm90aWZpY2F0aW9uQmFyXT1cImJvb2xlYW5cIlxuICogICAgICAgICAgICAgICAgICAgICAgICAgW3VwbG9hZEZvbGRlcnNdPVwiYm9vbGVhblwiXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICBbbXVsdGlwbGVGaWxlc109XCJib29sZWFuXCJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIFthY2NlcHRlZEZpbGVzVHlwZV09XCJzdHJpbmdcIlxuICogICAgICAgICAgICAgICAgICAgICAgICAgKG9uU3VjY2Vzcyk9XCJjdXN0b21NZXRob2QoJGV2ZW50KVwiPlxuICogPC9hbGZyZXNjby11cGxvYWQtYnV0dG9uPlxuICpcbiAqIFRoaXMgY29tcG9uZW50LCBwcm92aWRlIGEgc2V0IG9mIGJ1dHRvbnMgdG8gdXBsb2FkIGZpbGVzIHRvIGFsZnJlc2NvLlxuICpcbiAqIEBJbnB1dFBhcmFtIHtib29sZWFufSBbdHJ1ZV0gc2hvd1Vkb05vdGlmaWNhdGlvbkJhciAtIGhpZGUvc2hvdyBub3RpZmljYXRpb24gYmFyLlxuICogQElucHV0UGFyYW0ge2Jvb2xlYW59IFtmYWxzZV0gdmVyc2lvbmluZyAtIHRydWUgdG8gaW5kaWNhdGUgdGhhdCBhIG1ham9yIHZlcnNpb24gc2hvdWxkIGJlIGNyZWF0ZWRcbiAqIEBJbnB1dFBhcmFtIHtib29sZWFufSBbZmFsc2VdIHVwbG9hZEZvbGRlcnMgLSBhbGxvdy9kaXNhbGxvdyB1cGxvYWQgZm9sZGVycyAob25seSBmb3IgY2hyb21lKS5cbiAqIEBJbnB1dFBhcmFtIHtib29sZWFufSBbZmFsc2VdIG11bHRpcGxlRmlsZXMgLSBhbGxvdy9kaXNhbGxvdyBtdWx0aXBsZSBmaWxlcy5cbiAqIEBJbnB1dFBhcmFtIHtzdHJpbmd9IFsqXSBhY2NlcHRlZEZpbGVzVHlwZSAtIGFycmF5IG9mIGFsbG93ZWQgZmlsZSBleHRlbnNpb25zLlxuICogQElucHV0UGFyYW0ge2Jvb2xlYW59IFtmYWxzZV0gdmVyc2lvbmluZyAtIHRydWUgdG8gaW5kaWNhdGUgdGhhdCBhIG1ham9yIHZlcnNpb24gc2hvdWxkIGJlIGNyZWF0ZWRcbiAqIEBPdXRwdXQgLSBvblN1Y2Nlc3MgLSBUaGUgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSBmaWxlIGlzIHVwbG9hZGVkXG4gKlxuICogQHJldHVybnMge1VwbG9hZERyYWdBcmVhQ29tcG9uZW50fSAuXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWxmcmVzY28tdXBsb2FkLWJ1dHRvbicsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZTogXCI8Zm9ybT4gICAgIDwhLS1GaWxlcyBVcGxvYWQtLT4gICAgIDxkaXYgKm5nSWY9XFxcIiF1cGxvYWRGb2xkZXJzXFxcIiBjbGFzcz1cXFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLXJhaXNlZCBtZGwtYnV0dG9uLS1jb2xvcmVkIG1kbC1idXR0b24tLWZpbGVcXFwiPiAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+ZmlsZV91cGxvYWQ8L2k+ICAgICAgICAgIDwhLS1NdWx0aXBsZSBGaWxlcyBVcGxvYWQtLT4gICAgICAgICA8c3BhbiAqbmdJZj1cXFwibXVsdGlwbGVGaWxlc1xcXCI+ICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcInVwbG9hZC1tdWx0aXBsZS1maWxlc1xcXCI+e3snRklMRV9VUExPQUQuQlVUVE9OLlVQTE9BRF9GSUxFJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD4gICAgICAgICAgICAgPGlucHV0IGlkPVxcXCJ1cGxvYWQtbXVsdGlwbGUtZmlsZXNcXFwiIGRhdGEtYXV0b21hdGlvbi1pZD1cXFwidXBsb2FkLW11bHRpcGxlLWZpbGVzXFxcIiB0eXBlPVxcXCJmaWxlXFxcIiBuYW1lPVxcXCJ1cGxvYWRGaWxlc1xcXCIgICAgICAgICAgICAgICAgICAgIChjaGFuZ2UpPVxcXCJvbkZpbGVzQWRkZWQoJGV2ZW50KVxcXCIgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlPVxcXCJtdWx0aXBsZVxcXCIgICAgICAgICAgICAgICAgICAgIGFjY2VwdD1cXFwie3thY2NlcHRlZEZpbGVzVHlwZX19XFxcIiAgICAgICAgICAgICAgICAgICAgI3VwbG9hZEZpbGVzPiAgICAgICAgIDwvc3Bhbj4gICAgICAgICAgPCEtLVNpbmdsZSBGaWxlcyBVcGxvYWQtLT4gICAgICAgICA8c3BhbiAqbmdJZj1cXFwiIW11bHRpcGxlRmlsZXNcXFwiPiAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJ1cGxvYWQtc2luZ2xlLWZpbGVcXFwiPnt7J0ZJTEVfVVBMT0FELkJVVFRPTi5VUExPQURfRklMRScgfCB0cmFuc2xhdGV9fTwvbGFiZWw+ICAgICAgICAgICAgIDxpbnB1dCBpZD1cXFwidXBsb2FkLXNpbmdsZS1maWxlXFxcIiBkYXRhLWF1dG9tYXRpb24taWQ9XFxcInVwbG9hZC1zaW5nbGUtZmlsZVxcXCIgdHlwZT1cXFwiZmlsZVxcXCIgbmFtZT1cXFwidXBsb2FkRmlsZXNcXFwiICAgICAgICAgICAgICAgICAgICAoY2hhbmdlKT1cXFwib25GaWxlc0FkZGVkKCRldmVudClcXFwiICAgICAgICAgICAgICAgICAgICBhY2NlcHQ9XFxcInt7YWNjZXB0ZWRGaWxlc1R5cGV9fVxcXCIgICAgICAgICAgICAgICAgICAgICN1cGxvYWRGaWxlcz4gICAgICAgICA8L3NwYW4+ICAgICA8L2Rpdj4gICAgICA8IS0tRm9sZGVycyBVcGxvYWQtLT4gICAgIDxkaXYgKm5nSWY9XFxcInVwbG9hZEZvbGRlcnNcXFwiIGNsYXNzPVxcXCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0tcmFpc2VkIG1kbC1idXR0b24tLWNvbG9yZWQgbWRsLWJ1dHRvbi0tZmlsZVxcXCI+ICAgICAgICAgPGkgY2xhc3M9XFxcIm1hdGVyaWFsLWljb25zXFxcIj5maWxlX3VwbG9hZDwvaT4gICAgICAgICA8bGFiZWwgZm9yPVxcXCJ1cGxvYWRGb2xkZXJcXFwiPnt7J0ZJTEVfVVBMT0FELkJVVFRPTi5VUExPQURfRk9MREVSJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD4gICAgICAgICA8aW5wdXQgaWQ9XFxcInVwbG9hZEZvbGRlclxcXCIgZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJ1cGxvYWRGb2xkZXJcXFwiIHR5cGU9XFxcImZpbGVcXFwiIG5hbWU9XFxcInVwbG9hZEZpbGVzXFxcIiAgICAgICAgICAgICAgICAoY2hhbmdlKT1cXFwib25EaXJlY3RvcnlBZGRlZCgkZXZlbnQpXFxcIiAgICAgICAgICAgICAgICBtdWx0aXBsZT1cXFwibXVsdGlwbGVcXFwiICAgICAgICAgICAgICAgIGFjY2VwdD1cXFwie3thY2NlcHRlZEZpbGVzVHlwZX19XFxcIiAgICAgICAgICAgICAgICB3ZWJraXRkaXJlY3RvcnkgZGlyZWN0b3J5ICAgICAgICAgICAgICAgIG11bHRpcGxlICN1cGxvYWRGb2xkZXJzPiAgICAgPC9kaXY+IDwvZm9ybT4gIDwhLS1Ob3RpZmljYXRpb24gYmFyLS0+IDxkaXYgaWQ9XFxcInVuZG8tbm90aWZpY2F0aW9uLWJhclxcXCIgIGNsYXNzPVxcXCJtZGwtanMtc25hY2tiYXIgbWRsLXNuYWNrYmFyXFxcIiAgICAgICN1bmRvTm90aWZpY2F0aW9uQmFyPiAgICAgPGRpdiBjbGFzcz1cXFwibWRsLXNuYWNrYmFyX190ZXh0XFxcIj48L2Rpdj4gICAgIDxidXR0b24gZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJ1bmRvX3VwbG9hZF9idXR0b25cXFwiIGNsYXNzPVxcXCJtZGwtc25hY2tiYXJfX2FjdGlvblxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIj57eydGSUxFX1VQTE9BRC5BQ1RJT04uVU5ETycgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPiA8L2Rpdj5cIixcbiAgICBzdHlsZXM6IFtcIi5tZGwtYnV0dG9uLS1maWxlIGlucHV0IHsgICAgIGN1cnNvcjogcG9pbnRlcjsgICAgIGhlaWdodDogMTAwJTsgICAgIHJpZ2h0OiAwOyAgICAgb3BhY2l0eTogMDsgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgICAgIHRvcDogMDsgICAgIHdpZHRoOiAzMDBweDsgICAgIHotaW5kZXg6IDQ7IH0gIC5tZGwtdGV4dGZpZWxkLS1maWxlIC5tZGwtdGV4dGZpZWxkX19pbnB1dCB7ICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDMycHgpOyB9ICAubWRsLXRleHRmaWVsZC0tZmlsZSAubWRsLWJ1dHRvbi0tZmlsZSB7ICAgICByaWdodDogMDsgfVwiXVxufSlcbmV4cG9ydCBjbGFzcyBVcGxvYWRCdXR0b25Db21wb25lbnQge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9ST09UX0lEOiBzdHJpbmcgPSAnLXJvb3QtJztcblxuICAgIEBWaWV3Q2hpbGQoJ3VuZG9Ob3RpZmljYXRpb25CYXInKVxuICAgIHVuZG9Ob3RpZmljYXRpb25CYXI6IGFueTtcblxuICAgIEBJbnB1dCgpXG4gICAgc2hvd1Vkb05vdGlmaWNhdGlvbkJhcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIHVwbG9hZEZvbGRlcnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgbXVsdGlwbGVGaWxlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICB2ZXJzaW9uaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGFjY2VwdGVkRmlsZXNUeXBlOiBzdHJpbmcgPSAnKic7XG5cbiAgICBASW5wdXQoKVxuICAgIGN1cnJlbnRGb2xkZXJQYXRoOiBzdHJpbmcgPSAnLyc7XG5cbiAgICBASW5wdXQoKVxuICAgIHJvb3RGb2xkZXJJZDogc3RyaW5nID0gVXBsb2FkQnV0dG9uQ29tcG9uZW50LkRFRkFVTFRfUk9PVF9JRDtcblxuICAgIEBPdXRwdXQoKVxuICAgIG9uU3VjY2VzcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIG9uRXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBjcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0cmFuc2xhdGU6IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIF91cGxvYWRlclNlcnZpY2U6IFVwbG9hZFNlcnZpY2UsIHRyYW5zbGF0ZTogQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XG4gICAgICAgIHRyYW5zbGF0ZS5hZGRUcmFuc2xhdGlvbkZvbGRlcignbmcyLWFsZnJlc2NvLXVwbG9hZCcsICdub2RlX21vZHVsZXMvbmcyLWFsZnJlc2NvLXVwbG9hZC9zcmMnKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGxldCBmb3JtRmllbGRzID0gdGhpcy5jcmVhdGVGb3JtRmllbGRzKCk7XG4gICAgICAgIHRoaXMuX3VwbG9hZGVyU2VydmljZS5zZXRPcHRpb25zKGZvcm1GaWVsZHMsIHRoaXMudmVyc2lvbmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGNhbGxlZCB3aGVuIGZpbGVzIGFyZSBkcm9wcGVkIGluIHRoZSBkcmFnIGFyZWEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgLSBmaWxlcyBkcm9wcGVkIGluIHRoZSBkcmFnIGFyZWEuXG4gICAgICovXG4gICAgb25GaWxlc0FkZGVkKCRldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBmaWxlcyA9ICRldmVudC5jdXJyZW50VGFyZ2V0LmZpbGVzO1xuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzKHRoaXMuY3VycmVudEZvbGRlclBhdGgsIGZpbGVzKTtcbiAgICAgICAgLy8gcmVzZXQgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaWxlXG4gICAgICAgICRldmVudC50YXJnZXQudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gYSBmb2xkZXIgaXMgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGaWxlW119IGZpbGVzIC0gZmlsZXMgb2YgYSBmb2xkZXIgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhLlxuICAgICAqL1xuICAgIG9uRGlyZWN0b3J5QWRkZWQoJGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IGZpbGVzID0gJGV2ZW50LmN1cnJlbnRUYXJnZXQuZmlsZXM7XG4gICAgICAgIGxldCBoYXNoTWFwRGlyID0gdGhpcy5jb252ZXJ0SW50b0hhc2hNYXAoZmlsZXMpO1xuXG4gICAgICAgIGhhc2hNYXBEaXIuZm9yRWFjaCgoZmlsZXNEaXIsIGRpcmVjdG9yeVBhdGgpID0+IHtcbiAgICAgICAgICAgIGxldCBkaXJlY3RvcnlOYW1lID0gdGhpcy5nZXREaXJlY3RvcnlOYW1lKGRpcmVjdG9yeVBhdGgpO1xuICAgICAgICAgICAgbGV0IGFic29sdXRlUGF0aCA9IHRoaXMuY3VycmVudEZvbGRlclBhdGggKyB0aGlzLmdldERpcmVjdG9yeVBhdGgoZGlyZWN0b3J5UGF0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZGVyU2VydmljZS5jcmVhdGVGb2xkZXIoYWJzb2x1dGVQYXRoLCBkaXJlY3RvcnlOYW1lKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmVEaXIgPSB0aGlzLmN1cnJlbnRGb2xkZXJQYXRoICsgJy8nICsgZGlyZWN0b3J5UGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkRmlsZXMocmVsYXRpdmVEaXIsIGZpbGVzRGlyKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZVBsYWNlaG9sZGVyID0gdGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyb3IucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZVBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yLmVtaXQoe3ZhbHVlOiBlcnJvck1lc3NhZ2VQbGFjZWhvbGRlcn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSB0aGlzLmZvcm1hdFN0cmluZyhlcnJvck1lc3NhZ2VQbGFjZWhvbGRlciwgW2RpcmVjdG9yeU5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dFcnJvck5vdGlmaWNhdGlvbkJhcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZXNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpbGVcbiAgICAgICAgJGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCBhIGxpc3Qgb2YgZmlsZSBpbiB0aGUgc3BlY2lmaWVkIHBhdGhcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEBwYXJhbSBmaWxlc1xuICAgICAqL1xuICAgIHByaXZhdGUgdXBsb2FkRmlsZXMocGF0aDogc3RyaW5nLCBmaWxlczogYW55W10pIHtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGxhdGVzdEZpbGVzQWRkZWQgPSB0aGlzLl91cGxvYWRlclNlcnZpY2UuYWRkVG9RdWV1ZShmaWxlcyk7XG4gICAgICAgICAgICB0aGlzLl91cGxvYWRlclNlcnZpY2UudXBsb2FkRmlsZXNJblRoZVF1ZXVlKHRoaXMucm9vdEZvbGRlcklkLCBwYXRoLCB0aGlzLm9uU3VjY2Vzcyk7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93VWRvTm90aWZpY2F0aW9uQmFyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvd1VuZG9Ob3RpZmljYXRpb25CYXIobGF0ZXN0RmlsZXNBZGRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdCBjb252ZXJ0cyB0aGUgYXJyYXkgZ2l2ZW4gYXMgaW5wdXQgaW50byBhIG1hcC4gVGhlIG1hcCBpcyBhIGtleSB2YWx1ZXMgcGFpcnMsIHdoZXJlIHRoZSBrZXkgaXMgdGhlIGRpcmVjdG9yeSBuYW1lIGFuZCB0aGUgdmFsdWUgYXJlXG4gICAgICogYWxsIHRoZSBmaWxlcyB0aGF0IHRoZSBkaXJlY3RvcnkgY29udGFpbnMuXG4gICAgICogQHBhcmFtIGZpbGVzIC0gYXJyYXkgb2YgZmlsZXNcbiAgICAgKiBAcmV0dXJucyB7TWFwfVxuICAgICAqL1xuICAgIHByaXZhdGUgY29udmVydEludG9IYXNoTWFwKGZpbGVzOiBhbnlbXSkge1xuICAgICAgICBsZXQgZGlyZWN0b3J5TWFwID0gbmV3IE1hcDxzdHJpbmcsIE9iamVjdFtdPigpO1xuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBsZXQgZGlyZWN0b3J5ID0gdGhpcy5nZXREaXJlY3RvcnlQYXRoKGZpbGUud2Via2l0UmVsYXRpdmVQYXRoKTtcbiAgICAgICAgICAgIGxldCBmaWxlc1NvbWVEaXIgPSBkaXJlY3RvcnlNYXAuZ2V0KGRpcmVjdG9yeSkgfHwgW107XG4gICAgICAgICAgICBmaWxlc1NvbWVEaXIucHVzaChmaWxlKTtcbiAgICAgICAgICAgIGRpcmVjdG9yeU1hcC5zZXQoZGlyZWN0b3J5LCBmaWxlc1NvbWVEaXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJlY3RvcnlNYXA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3BsaXQgdGhlIGRpcmVjdG9yeSBwYXRoIGdpdmVuIGFzIGlucHV0IGFuZCBjdXQgdGhlIGxhc3QgZGlyZWN0b3J5IG5hbWVcbiAgICAgKiBAcGFyYW0gZGlyZWN0b3J5XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldERpcmVjdG9yeVBhdGgoZGlyZWN0b3J5OiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlbGF0aXZlRGlyUGF0aCA9ICcnO1xuICAgICAgICBsZXQgZGlyUGF0aCA9IGRpcmVjdG9yeS5zcGxpdCgnLycpO1xuICAgICAgICBpZiAoZGlyUGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBkaXJQYXRoLnBvcCgpO1xuICAgICAgICAgICAgcmVsYXRpdmVEaXJQYXRoID0gJy8nICsgZGlyUGF0aC5qb2luKCcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbGF0aXZlRGlyUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGxpdCBhIGRpcmVjdG9yeSBwYXRoIHBhc3NlZCBpbiBpbnB1dCBhbmQgcmV0dXJuIHRoZSBmaXJzdCBkaXJlY3RvcnkgbmFtZVxuICAgICAqIEBwYXJhbSBkaXJlY3RvcnlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RGlyZWN0b3J5TmFtZShkaXJlY3Rvcnk6IHN0cmluZykge1xuICAgICAgICBsZXQgZGlyUGF0aCA9IGRpcmVjdG9yeS5zcGxpdCgnLycpO1xuICAgICAgICBpZiAoZGlyUGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyUGF0aC5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkaXJQYXRoWzBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB1bmRvIG5vdGlmaWNhdGlvbiBiYXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0ZpbGVNb2RlbFtdfSBsYXRlc3RGaWxlc0FkZGVkIC0gZmlsZXMgaW4gdGhlIHVwbG9hZCBxdWV1ZSBlbnJpY2hlZCB3aXRoIHN0YXR1cyBmbGFnIGFuZCB4aHIgb2JqZWN0LlxuICAgICAqL1xuICAgIHByaXZhdGUgX3Nob3dVbmRvTm90aWZpY2F0aW9uQmFyKGxhdGVzdEZpbGVzQWRkZWQ6IEZpbGVNb2RlbFtdKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWVzc2FnZVRyYW5zbGF0ZTogYW55LCBhY3Rpb25UcmFuc2xhdGU6IGFueTtcbiAgICAgICAgbWVzc2FnZVRyYW5zbGF0ZSA9IHRoaXMudHJhbnNsYXRlLmdldCgnRklMRV9VUExPQUQuTUVTU0FHRVMuUFJPR1JFU1MnKTtcbiAgICAgICAgYWN0aW9uVHJhbnNsYXRlID0gdGhpcy50cmFuc2xhdGUuZ2V0KCdGSUxFX1VQTE9BRC5BQ1RJT04uVU5ETycpO1xuXG4gICAgICAgIGlmICh0aGlzLnVuZG9Ob3RpZmljYXRpb25CYXIubmF0aXZlRWxlbWVudC5NYXRlcmlhbFNuYWNrYmFyKSB7XG4gICAgICAgICAgICB0aGlzLnVuZG9Ob3RpZmljYXRpb25CYXIubmF0aXZlRWxlbWVudC5NYXRlcmlhbFNuYWNrYmFyLnNob3dTbmFja2Jhcih7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVRyYW5zbGF0ZS52YWx1ZSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAzMDAwLFxuICAgICAgICAgICAgICAgIGFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0RmlsZXNBZGRlZC5mb3JFYWNoKCh1cGxvYWRpbmdGaWxlTW9kZWw6IEZpbGVNb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nRmlsZU1vZGVsLmVtaXRBYm9ydCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFjdGlvblRleHQ6IGFjdGlvblRyYW5zbGF0ZS52YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaXZlIHRoZSBlcnJvciBtZXNzYWdlIHVzaW5nIHRoZSBlcnJvciBzdGF0dXMgY29kZVxuICAgICAqIEBwYXJhbSByZXNwb25zZSAtIG9iamVjdCB0aGF0IGNvbnRhaW4gdGhlIEhUVFAgcmVzcG9uc2VcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RXJyb3JNZXNzYWdlKHJlc3BvbnNlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAocmVzcG9uc2UuYm9keSAmJiByZXNwb25zZS5ib2R5LmVycm9yLnN0YXR1c0NvZGUgPT09IEVSUk9SX0ZPTERFUl9BTFJFQURZX0VYSVNUKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlOiBhbnk7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0aGlzLnRyYW5zbGF0ZS5nZXQoJ0ZJTEVfVVBMT0FELk1FU1NBR0VTLkZPTERFUl9BTFJFQURZX0VYSVNUJyk7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNZXNzYWdlLnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZXJyb3IgaW5zaWRlIE5vdGlmaWNhdGlvbiBiYXJcbiAgICAgKiBAcGFyYW0gRXJyb3IgbWVzc2FnZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHJpdmF0ZSBfc2hvd0Vycm9yTm90aWZpY2F0aW9uQmFyKGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51bmRvTm90aWZpY2F0aW9uQmFyLm5hdGl2ZUVsZW1lbnQuTWF0ZXJpYWxTbmFja2Jhcikge1xuICAgICAgICAgICAgdGhpcy51bmRvTm90aWZpY2F0aW9uQmFyLm5hdGl2ZUVsZW1lbnQuTWF0ZXJpYWxTbmFja2Jhci5zaG93U25hY2tiYXIoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAzMDAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgYSBwbGFjZWhvbGRlciB7MH0gaW4gYSBtZXNzYWdlIHdpdGggdGhlIGlucHV0IGtleXNcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSAtIHRoZSBtZXNzYWdlIHRoYXQgY29uYWlucyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgKiBAcGFyYW0ga2V5cyAtIGFycmF5IG9mIHZhbHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbWVzc2FnZSB3aXRob3V0IHBsYWNlaG9sZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBmb3JtYXRTdHJpbmcobWVzc2FnZTogc3RyaW5nLCBrZXlzOiBhbnkgW10pIHtcbiAgICAgICAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxceycgKyBpICsgJ1xcXFx9JywgJ2dtJyksIGtleXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRm9ybUZpZWxkcygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9ybUZpZWxkczoge1xuICAgICAgICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==
