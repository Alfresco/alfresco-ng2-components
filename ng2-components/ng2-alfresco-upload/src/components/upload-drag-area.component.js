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
var ERROR_FOLDER_ALREADY_EXIST = 409;
var UploadDragAreaComponent = UploadDragAreaComponent_1 = (function () {
    function UploadDragAreaComponent(_uploaderService, translate) {
        this._uploaderService = _uploaderService;
        this.showUdoNotificationBar = true;
        this.versioning = false;
        this.currentFolderPath = '/';
        this.rootFolderId = UploadDragAreaComponent_1.DEFAULT_ROOT_ID;
        this.onSuccess = new core_1.EventEmitter();
        this.translate = translate;
        translate.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
    }
    UploadDragAreaComponent.prototype.ngOnChanges = function (changes) {
        var formFields = this.createFormFields();
        this._uploaderService.setOptions(formFields, this.versioning);
    };
    UploadDragAreaComponent.prototype.onFilesDropped = function (files) {
        if (files.length) {
            if (this.checkValidity(files)) {
                this._uploaderService.addToQueue(files);
                this._uploaderService.uploadFilesInTheQueue(this.rootFolderId, this.currentFolderPath, this.onSuccess);
                var latestFilesAdded = this._uploaderService.getQueue();
                if (this.showUdoNotificationBar) {
                    this._showUndoNotificationBar(latestFilesAdded);
                }
            }
            else {
                var errorMessage = void 0;
                errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
                if (this.showUdoNotificationBar) {
                    this._showErrorNotificationBar(errorMessage.value);
                }
                else {
                    console.error(errorMessage.value);
                }
            }
        }
    };
    UploadDragAreaComponent.prototype.checkValidity = function (files) {
        if (files.length && files[0].type === '') {
            return false;
        }
        return true;
    };
    UploadDragAreaComponent.prototype.onFilesEntityDropped = function (item) {
        var _this = this;
        item.file(function (file) {
            _this._uploaderService.addToQueue([file]);
            var path = item.fullPath.replace(item.name, '');
            var filePath = _this.currentFolderPath + path;
            _this._uploaderService.uploadFilesInTheQueue(_this.rootFolderId, filePath, _this.onSuccess);
        });
    };
    UploadDragAreaComponent.prototype.onFolderEntityDropped = function (folder) {
        var _this = this;
        if (folder.isDirectory) {
            var relativePath = folder.fullPath.replace(folder.name, '');
            relativePath = this.currentFolderPath + relativePath;
            this._uploaderService.createFolder(relativePath, folder.name)
                .subscribe(function (message) {
                _this.onSuccess.emit({
                    value: 'Created folder'
                });
                var dirReader = folder.createReader();
                dirReader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        _this._traverseFileTree(entries[i]);
                    }
                    if (_this.showUdoNotificationBar) {
                        var latestFilesAdded = _this._uploaderService.getQueue();
                        _this._showUndoNotificationBar(latestFilesAdded);
                    }
                });
            }, function (error) {
                var errorMessagePlaceholder = _this.getErrorMessage(error.response);
                var errorMessage = _this.formatString(errorMessagePlaceholder, [folder.name]);
                if (_this.showUdoNotificationBar) {
                    _this._showErrorNotificationBar(errorMessage);
                }
                else {
                    console.error(errorMessage);
                }
            });
        }
    };
    UploadDragAreaComponent.prototype._traverseFileTree = function (item) {
        if (item.isFile) {
            this.onFilesEntityDropped(item);
        }
        else {
            if (item.isDirectory) {
                this.onFolderEntityDropped(item);
            }
        }
    };
    UploadDragAreaComponent.prototype._showUndoNotificationBar = function (latestFilesAdded) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
        var messageTranslate, actionTranslate;
        messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');
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
    };
    UploadDragAreaComponent.prototype._showErrorNotificationBar = function (errorMessage) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: errorMessage,
            timeout: 3000
        });
    };
    UploadDragAreaComponent.prototype.getErrorMessage = function (response) {
        if (response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            var errorMessage = void 0;
            errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    };
    UploadDragAreaComponent.prototype.formatString = function (message, keys) {
        if (message) {
            var i = keys.length;
            while (i--) {
                message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
            }
        }
        return message;
    };
    UploadDragAreaComponent.prototype.createFormFields = function () {
        return {
            formFields: {
                overwrite: true
            }
        };
    };
    return UploadDragAreaComponent;
}());
UploadDragAreaComponent.DEFAULT_ROOT_ID = '-root-';
__decorate([
    core_1.ViewChild('undoNotificationBar'),
    __metadata("design:type", Object)
], UploadDragAreaComponent.prototype, "undoNotificationBar", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadDragAreaComponent.prototype, "showUdoNotificationBar", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], UploadDragAreaComponent.prototype, "versioning", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UploadDragAreaComponent.prototype, "currentFolderPath", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UploadDragAreaComponent.prototype, "rootFolderId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UploadDragAreaComponent.prototype, "onSuccess", void 0);
UploadDragAreaComponent = UploadDragAreaComponent_1 = __decorate([
    core_1.Component({
        selector: 'alfresco-upload-drag-area',
        moduleId: module.id,
        template: "<div file-draggable id='UploadBorder' class=\"upload-border\"      (onFilesDropped)=\"onFilesDropped($event)\"      (onFilesEntityDropped)=\"onFilesEntityDropped($event)\"      (onFolderEntityDropped)=\"onFolderEntityDropped($event)\"      dropzone=\"\" webkitdropzone=\"*\" #droparea>     <ng-content></ng-content> </div>  <!--Notification bar--> <div id=\"undo-notification-bar\"  class=\"mdl-js-snackbar mdl-snackbar\"      #undoNotificationBar>     <div class=\"mdl-snackbar__text\"></div>     <button data-automation-id=\"undo_upload_button\" class=\"mdl-snackbar__action\" type=\"button\">{{'FILE_UPLOAD.ACTION.UNDO' | translate}}</button> </div>",
        styles: [".upload-border {     vertical-align: middle;     color: #555;     text-align: center; }  .input-focus {     color: #2196F3;     margin-left: 3px;     border: 3px dashed #2196F3; }"]
    }),
    __metadata("design:paramtypes", [upload_service_1.UploadService, ng2_alfresco_core_1.AlfrescoTranslationService])
], UploadDragAreaComponent);
exports.UploadDragAreaComponent = UploadDragAreaComponent;
var UploadDragAreaComponent_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXBsb2FkLWRyYWctYXJlYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUFrRjtBQUNsRiw2REFBMkQ7QUFDM0QsdURBQStEO0FBSy9ELElBQU0sMEJBQTBCLEdBQUcsR0FBRyxDQUFDO0FBaUJ2QyxJQUFhLHVCQUF1QjtJQXdCaEMsaUNBQW9CLGdCQUErQixFQUFFLFNBQXFDO1FBQXRFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBZTtRQWhCbkQsMkJBQXNCLEdBQVksSUFBSSxDQUFDO1FBR3ZDLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFHNUIsc0JBQWlCLEdBQVcsR0FBRyxDQUFDO1FBR2hDLGlCQUFZLEdBQVcseUJBQXVCLENBQUMsZUFBZSxDQUFDO1FBRy9ELGNBQVMsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUszQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixTQUFTLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQsNkNBQVcsR0FBWCxVQUFZLE9BQU87UUFDZixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQU9ELGdEQUFjLEdBQWQsVUFBZSxLQUFhO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZHLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLFlBQVksU0FBSyxDQUFDO2dCQUN0QixZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQztnQkFDL0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQU9ELCtDQUFhLEdBQWIsVUFBYyxLQUFhO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQU1ELHNEQUFvQixHQUFwQixVQUFxQixJQUFTO1FBQTlCLGlCQU9DO1FBTkcsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFDLElBQVM7WUFDakIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRCxJQUFJLFFBQVEsR0FBRyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQzdDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBTUQsdURBQXFCLEdBQXJCLFVBQXNCLE1BQVc7UUFBakMsaUJBa0NDO1FBakNHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUQsWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUM7WUFFckQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQztpQkFDeEQsU0FBUyxDQUNOLFVBQUEsT0FBTztnQkFDSCxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztvQkFDaEIsS0FBSyxFQUFFLGdCQUFnQjtpQkFDMUIsQ0FBQyxDQUFDO2dCQUNILElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFDLE9BQVk7b0JBQy9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUN0QyxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQzt3QkFDOUIsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ3hELEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNwRCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUNELFVBQUEsS0FBSztnQkFDRCxJQUFJLHVCQUF1QixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDakQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO1lBRUwsQ0FBQyxDQUNKLENBQUM7UUFDVixDQUFDO0lBQ0wsQ0FBQztJQU9PLG1EQUFpQixHQUF6QixVQUEwQixJQUFTO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBT08sMERBQXdCLEdBQWhDLFVBQWlDLGdCQUE2QjtRQUMxRCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDbkIsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QyxDQUFDO1FBRUQsSUFBSSxnQkFBcUIsRUFBRSxlQUFvQixDQUFDO1FBQ2hELGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDdkUsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7WUFDakUsT0FBTyxFQUFFLGdCQUFnQixDQUFDLEtBQUs7WUFDL0IsT0FBTyxFQUFFLElBQUk7WUFDYixhQUFhLEVBQUU7Z0JBQ1gsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsa0JBQTZCO29CQUNuRCxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsVUFBVSxFQUFFLGVBQWUsQ0FBQyxLQUFLO1NBQ3BDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFPTywyREFBeUIsR0FBakMsVUFBa0MsWUFBb0I7UUFDbEQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ25CLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUMsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO1lBQ2pFLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLE9BQU8sRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFPTyxpREFBZSxHQUF2QixVQUF3QixRQUFhO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxZQUFZLFNBQUssQ0FBQztZQUN0QixZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUMvRSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUM5QixDQUFDO0lBQ0wsQ0FBQztJQVFPLDhDQUFZLEdBQXBCLFVBQXFCLE9BQWUsRUFBRSxJQUFZO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDVCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLGtEQUFnQixHQUF4QjtRQUNJLE1BQU0sQ0FBQztZQUNILFVBQVUsRUFBRTtnQkFDUixTQUFTLEVBQUUsSUFBSTthQUNsQjtTQUNKLENBQUM7SUFDTixDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQTFOQSxBQTBOQyxJQUFBO0FBeE5rQix1Q0FBZSxHQUFXLFFBQVEsQ0FBQztBQUdsRDtJQURDLGdCQUFTLENBQUMscUJBQXFCLENBQUM7O29FQUNSO0FBR3pCO0lBREMsWUFBSyxFQUFFOzt1RUFDK0I7QUFHdkM7SUFEQyxZQUFLLEVBQUU7OzJEQUNvQjtBQUc1QjtJQURDLFlBQUssRUFBRTs7a0VBQ3dCO0FBR2hDO0lBREMsWUFBSyxFQUFFOzs2REFDdUQ7QUFHL0Q7SUFEQyxhQUFNLEVBQUU7OzBEQUNzQjtBQXBCdEIsdUJBQXVCO0lBTm5DLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsMkJBQTJCO1FBQ3JDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixRQUFRLEVBQUUsOG9CQUE4b0I7UUFDeHBCLE1BQU0sRUFBRSxDQUFDLHFMQUFxTCxDQUFDO0tBQ2xNLENBQUM7cUNBeUJ3Qyw4QkFBYSxFQUFhLDhDQUEwQjtHQXhCakYsdUJBQXVCLENBME5uQztBQTFOWSwwREFBdUIiLCJmaWxlIjoiY29tcG9uZW50cy91cGxvYWQtZHJhZy1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVwbG9hZFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy91cGxvYWQuc2VydmljZSc7XG5pbXBvcnQgeyBBbGZyZXNjb1RyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcbmltcG9ydCB7IEZpbGVNb2RlbCB9IGZyb20gJy4uL21vZGVscy9maWxlLm1vZGVsJztcblxuZGVjbGFyZSBsZXQgY29tcG9uZW50SGFuZGxlcjogYW55O1xuXG5jb25zdCBFUlJPUl9GT0xERVJfQUxSRUFEWV9FWElTVCA9IDQwOTtcblxuLyoqXG4gKiA8YWxmcmVzY28tdXBsb2FkLWRyYWctYXJlYSAob25TdWNjZXNzKT1cImN1c3RvbU1ldGhvZCgkZXZlbnQpPjwvYWxmcmVzY28tdXBsb2FkLWRyYWctYXJlYT5cbiAqXG4gKiBUaGlzIGNvbXBvbmVudCwgcHJvdmlkZSBhIGRyYWcgYW5kIGRyb3AgYXJlIHRvIHVwbG9hZCBmaWxlcyB0byBhbGZyZXNjby5cbiAqXG4gKiBAT3V0cHV0IC0gb25TdWNjZXNzIC0gVGhlIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgZmlsZSBpcyB1cGxvYWRlZFxuICpcbiAqIEByZXR1cm5zIHtVcGxvYWREcmFnQXJlYUNvbXBvbmVudH0gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FsZnJlc2NvLXVwbG9hZC1kcmFnLWFyZWEnLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGU6IFwiPGRpdiBmaWxlLWRyYWdnYWJsZSBpZD0nVXBsb2FkQm9yZGVyJyBjbGFzcz1cXFwidXBsb2FkLWJvcmRlclxcXCIgICAgICAob25GaWxlc0Ryb3BwZWQpPVxcXCJvbkZpbGVzRHJvcHBlZCgkZXZlbnQpXFxcIiAgICAgIChvbkZpbGVzRW50aXR5RHJvcHBlZCk9XFxcIm9uRmlsZXNFbnRpdHlEcm9wcGVkKCRldmVudClcXFwiICAgICAgKG9uRm9sZGVyRW50aXR5RHJvcHBlZCk9XFxcIm9uRm9sZGVyRW50aXR5RHJvcHBlZCgkZXZlbnQpXFxcIiAgICAgIGRyb3B6b25lPVxcXCJcXFwiIHdlYmtpdGRyb3B6b25lPVxcXCIqXFxcIiAjZHJvcGFyZWE+ICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+IDwvZGl2PiAgPCEtLU5vdGlmaWNhdGlvbiBiYXItLT4gPGRpdiBpZD1cXFwidW5kby1ub3RpZmljYXRpb24tYmFyXFxcIiAgY2xhc3M9XFxcIm1kbC1qcy1zbmFja2JhciBtZGwtc25hY2tiYXJcXFwiICAgICAgI3VuZG9Ob3RpZmljYXRpb25CYXI+ICAgICA8ZGl2IGNsYXNzPVxcXCJtZGwtc25hY2tiYXJfX3RleHRcXFwiPjwvZGl2PiAgICAgPGJ1dHRvbiBkYXRhLWF1dG9tYXRpb24taWQ9XFxcInVuZG9fdXBsb2FkX2J1dHRvblxcXCIgY2xhc3M9XFxcIm1kbC1zbmFja2Jhcl9fYWN0aW9uXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiPnt7J0ZJTEVfVVBMT0FELkFDVElPTi5VTkRPJyB8IHRyYW5zbGF0ZX19PC9idXR0b24+IDwvZGl2PlwiLFxuICAgIHN0eWxlczogW1wiLnVwbG9hZC1ib3JkZXIgeyAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTsgICAgIGNvbG9yOiAjNTU1OyAgICAgdGV4dC1hbGlnbjogY2VudGVyOyB9ICAuaW5wdXQtZm9jdXMgeyAgICAgY29sb3I6ICMyMTk2RjM7ICAgICBtYXJnaW4tbGVmdDogM3B4OyAgICAgYm9yZGVyOiAzcHggZGFzaGVkICMyMTk2RjM7IH1cIl1cbn0pXG5leHBvcnQgY2xhc3MgVXBsb2FkRHJhZ0FyZWFDb21wb25lbnQge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9ST09UX0lEOiBzdHJpbmcgPSAnLXJvb3QtJztcblxuICAgIEBWaWV3Q2hpbGQoJ3VuZG9Ob3RpZmljYXRpb25CYXInKVxuICAgIHVuZG9Ob3RpZmljYXRpb25CYXI6IGFueTtcblxuICAgIEBJbnB1dCgpXG4gICAgc2hvd1Vkb05vdGlmaWNhdGlvbkJhcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIHZlcnNpb25pbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgY3VycmVudEZvbGRlclBhdGg6IHN0cmluZyA9ICcvJztcblxuICAgIEBJbnB1dCgpXG4gICAgcm9vdEZvbGRlcklkOiBzdHJpbmcgPSBVcGxvYWREcmFnQXJlYUNvbXBvbmVudC5ERUZBVUxUX1JPT1RfSUQ7XG5cbiAgICBAT3V0cHV0KClcbiAgICBvblN1Y2Nlc3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0cmFuc2xhdGU6IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfdXBsb2FkZXJTZXJ2aWNlOiBVcGxvYWRTZXJ2aWNlLCB0cmFuc2xhdGU6IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICAgICAgICB0cmFuc2xhdGUuYWRkVHJhbnNsYXRpb25Gb2xkZXIoJ25nMi1hbGZyZXNjby11cGxvYWQnLCAnbm9kZV9tb2R1bGVzL25nMi1hbGZyZXNjby11cGxvYWQvc3JjJyk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IHRoaXMuY3JlYXRlRm9ybUZpZWxkcygpO1xuICAgICAgICB0aGlzLl91cGxvYWRlclNlcnZpY2Uuc2V0T3B0aW9ucyhmb3JtRmllbGRzLCB0aGlzLnZlcnNpb25pbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgd2hlbiBmaWxlcyBhcmUgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGaWxlW119IGZpbGVzIC0gZmlsZXMgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhLlxuICAgICAqL1xuICAgIG9uRmlsZXNEcm9wcGVkKGZpbGVzOiBGaWxlW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tWYWxpZGl0eShmaWxlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGxvYWRlclNlcnZpY2UuYWRkVG9RdWV1ZShmaWxlcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBsb2FkZXJTZXJ2aWNlLnVwbG9hZEZpbGVzSW5UaGVRdWV1ZSh0aGlzLnJvb3RGb2xkZXJJZCwgdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCwgdGhpcy5vblN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgIGxldCBsYXRlc3RGaWxlc0FkZGVkID0gdGhpcy5fdXBsb2FkZXJTZXJ2aWNlLmdldFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1Vkb05vdGlmaWNhdGlvbkJhcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG93VW5kb05vdGlmaWNhdGlvbkJhcihsYXRlc3RGaWxlc0FkZGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U6IGFueTtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0aGlzLnRyYW5zbGF0ZS5nZXQoJ0ZJTEVfVVBMT0FELk1FU1NBR0VTLkZPTERFUl9OT1RfU1VQUE9SVEVEJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1Vkb05vdGlmaWNhdGlvbkJhcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG93RXJyb3JOb3RpZmljYXRpb25CYXIoZXJyb3JNZXNzYWdlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWwgdGhlIGZpbGUgaXMgdmFsaWQgb3Igbm90XG4gICAgICogQHBhcmFtIGZpbGVzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hlY2tWYWxpZGl0eShmaWxlczogRmlsZVtdKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggJiYgZmlsZXNbMF0udHlwZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBhcmUgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhXG4gICAgICogQHBhcmFtIGl0ZW0gLSBGaWxlRW50aXR5XG4gICAgICovXG4gICAgb25GaWxlc0VudGl0eURyb3BwZWQoaXRlbTogYW55KTogdm9pZCB7XG4gICAgICAgIGl0ZW0uZmlsZSggKGZpbGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdXBsb2FkZXJTZXJ2aWNlLmFkZFRvUXVldWUoW2ZpbGVdKTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gaXRlbS5mdWxsUGF0aC5yZXBsYWNlKGl0ZW0ubmFtZSwgJycpO1xuICAgICAgICAgICAgbGV0IGZpbGVQYXRoID0gdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCArIHBhdGg7XG4gICAgICAgICAgICB0aGlzLl91cGxvYWRlclNlcnZpY2UudXBsb2FkRmlsZXNJblRoZVF1ZXVlKHRoaXMucm9vdEZvbGRlcklkLCBmaWxlUGF0aCwgdGhpcy5vblN1Y2Nlc3MpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIGZvbGRlciBhcmUgZHJvcHBlZCBpbiB0aGUgZHJhZyBhcmVhXG4gICAgICogQHBhcmFtIGZvbGRlciAtIG5hbWUgb2YgdGhlIGRyb3BwZWQgZm9sZGVyXG4gICAgICovXG4gICAgb25Gb2xkZXJFbnRpdHlEcm9wcGVkKGZvbGRlcjogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChmb2xkZXIuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZVBhdGggPSBmb2xkZXIuZnVsbFBhdGgucmVwbGFjZShmb2xkZXIubmFtZSwgJycpO1xuICAgICAgICAgICAgcmVsYXRpdmVQYXRoID0gdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCArIHJlbGF0aXZlUGF0aDtcblxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkZXJTZXJ2aWNlLmNyZWF0ZUZvbGRlcihyZWxhdGl2ZVBhdGgsIGZvbGRlci5uYW1lKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdDcmVhdGVkIGZvbGRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRpclJlYWRlciA9IGZvbGRlci5jcmVhdGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpclJlYWRlci5yZWFkRW50cmllcygoZW50cmllczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyYXZlcnNlRmlsZVRyZWUoZW50cmllc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dVZG9Ob3RpZmljYXRpb25CYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVzdEZpbGVzQWRkZWQgPSB0aGlzLl91cGxvYWRlclNlcnZpY2UuZ2V0UXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd1VuZG9Ob3RpZmljYXRpb25CYXIobGF0ZXN0RmlsZXNBZGRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2VQbGFjZWhvbGRlciA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSB0aGlzLmZvcm1hdFN0cmluZyhlcnJvck1lc3NhZ2VQbGFjZWhvbGRlciwgW2ZvbGRlci5uYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG93VWRvTm90aWZpY2F0aW9uQmFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yTm90aWZpY2F0aW9uQmFyKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnMgYWxsIHRoZSBmaWxlcyBhbmQgZm9sZGVycywgYW5kIGNyZWF0ZSBpdCBvbiB0aGUgYWxmcmVzY28uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSAtIGNhbiBjb250YWlucyBmaWxlcyBvciBmb2xkZXJzLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3RyYXZlcnNlRmlsZVRyZWUoaXRlbTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChpdGVtLmlzRmlsZSkge1xuICAgICAgICAgICAgdGhpcy5vbkZpbGVzRW50aXR5RHJvcHBlZChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkZvbGRlckVudGl0eURyb3BwZWQoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHVuZG8gbm90aWZpY2F0aW9uIGJhci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmlsZU1vZGVsW119IGxhdGVzdEZpbGVzQWRkZWQgLSBmaWxlcyBpbiB0aGUgdXBsb2FkIHF1ZXVlIGVucmljaGVkIHdpdGggc3RhdHVzIGZsYWcgYW5kIHhociBvYmplY3QuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfc2hvd1VuZG9Ob3RpZmljYXRpb25CYXIobGF0ZXN0RmlsZXNBZGRlZDogRmlsZU1vZGVsW10pIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtZXNzYWdlVHJhbnNsYXRlOiBhbnksIGFjdGlvblRyYW5zbGF0ZTogYW55O1xuICAgICAgICBtZXNzYWdlVHJhbnNsYXRlID0gdGhpcy50cmFuc2xhdGUuZ2V0KCdGSUxFX1VQTE9BRC5NRVNTQUdFUy5QUk9HUkVTUycpO1xuICAgICAgICBhY3Rpb25UcmFuc2xhdGUgPSB0aGlzLnRyYW5zbGF0ZS5nZXQoJ0ZJTEVfVVBMT0FELkFDVElPTi5VTkRPJyk7XG5cbiAgICAgICAgdGhpcy51bmRvTm90aWZpY2F0aW9uQmFyLm5hdGl2ZUVsZW1lbnQuTWF0ZXJpYWxTbmFja2Jhci5zaG93U25hY2tiYXIoe1xuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVRyYW5zbGF0ZS52YWx1ZSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgICAgICBhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGF0ZXN0RmlsZXNBZGRlZC5mb3JFYWNoKCh1cGxvYWRpbmdGaWxlTW9kZWw6IEZpbGVNb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmdGaWxlTW9kZWwuZW1pdEFib3J0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWN0aW9uVGV4dDogYWN0aW9uVHJhbnNsYXRlLnZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVycm9yIGluc2lkZSBOb3RpZmljYXRpb24gYmFyXG4gICAgICogQHBhcmFtIEVycm9yIG1lc3NhZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHByaXZhdGUgX3Nob3dFcnJvck5vdGlmaWNhdGlvbkJhcihlcnJvck1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBpZiAoY29tcG9uZW50SGFuZGxlcikge1xuICAgICAgICAgICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmRvTm90aWZpY2F0aW9uQmFyLm5hdGl2ZUVsZW1lbnQuTWF0ZXJpYWxTbmFja2Jhci5zaG93U25hY2tiYXIoe1xuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICAgICAgICAgICAgdGltZW91dDogMzAwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaXZlIHRoZSBlcnJvciBtZXNzYWdlIHVzaW5nIHRoZSBlcnJvciBzdGF0dXMgY29kZVxuICAgICAqIEBwYXJhbSByZXNwb25zZSAtIG9iamVjdCB0aGF0IGNvbnRhaW4gdGhlIEhUVFAgcmVzcG9uc2VcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RXJyb3JNZXNzYWdlKHJlc3BvbnNlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAocmVzcG9uc2UuYm9keS5lcnJvci5zdGF0dXNDb2RlID09PSBFUlJPUl9GT0xERVJfQUxSRUFEWV9FWElTVCkge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTogYW55O1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gdGhpcy50cmFuc2xhdGUuZ2V0KCdGSUxFX1VQTE9BRC5NRVNTQUdFUy5GT0xERVJfQUxSRUFEWV9FWElTVCcpO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZS52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgYSBwbGFjZWhvbGRlciB7MH0gaW4gYSBtZXNzYWdlIHdpdGggdGhlIGlucHV0IGtleXNcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSAtIHRoZSBtZXNzYWdlIHRoYXQgY29uYWlucyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgKiBAcGFyYW0ga2V5cyAtIGFycmF5IG9mIHZhbHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbWVzc2FnZSB3aXRob3V0IHBsYWNlaG9sZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBmb3JtYXRTdHJpbmcobWVzc2FnZTogc3RyaW5nLCBrZXlzOiBhbnkgW10pIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGxldCBpID0ga2V5cy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxceycgKyBpICsgJ1xcXFx9JywgJ2dtJyksIGtleXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRm9ybUZpZWxkcygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9ybUZpZWxkczoge1xuICAgICAgICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==
