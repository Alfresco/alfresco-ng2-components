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
var testing_1 = require("@angular/core/testing");
var file_uploading_dialog_component_1 = require("./file-uploading-dialog.component");
var file_uploading_list_component_1 = require("./file-uploading-list.component");
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var upload_service_1 = require("../services/upload.service");
var file_model_1 = require("../models/file.model");
describe('Test ng2-alfresco-upload FileUploadDialog', function () {
    var injector;
    var component;
    var fixture;
    var debug;
    var element;
    var file;
    beforeEach(testing_1.async(function () {
        injector = core_1.ReflectiveInjector.resolveAndCreate([
            upload_service_1.UploadService
        ]);
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [file_uploading_dialog_component_1.FileUploadingDialogComponent, file_uploading_list_component_1.FileUploadingListComponent],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService,
                upload_service_1.UploadService
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        window['componentHandler'] = null;
        var fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        file = new file_model_1.FileModel(fileFake);
        fixture = testing_1.TestBed.createComponent(file_uploading_dialog_component_1.FileUploadingDialogComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.filesUploadingList = [file];
        fixture.detectChanges();
    });
    afterEach(function () {
        fixture.destroy();
        testing_1.TestBed.resetTestingModule();
    });
    it('should render completed upload 1 when an element is added to Observer', function () {
        component._uploaderService.updateFileCounterStream(1);
        fixture.detectChanges();
        expect(element.querySelector('#total-upload-completed').innerText).toEqual('1');
    });
    it('should render dialog box with css class show when an element is added to Observer', function () {
        component._uploaderService.addToQueue([file]);
        component.filesUploadingList = [file];
        fixture.detectChanges();
        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });
    it('should render dialog box with css class show when the toggleShowDialog is called', function () {
        component.toggleShowDialog();
        fixture.detectChanges();
        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });
    it('should render dialog box with css class hide', function () {
        component.isDialogActive = true;
        component.toggleShowDialog();
        fixture.detectChanges();
        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog');
    });
    it('should render minimize dialog as default', function () {
        component.isDialogActive = true;
        component.toggleDialogMinimize();
        fixture.detectChanges();
        expect(element.querySelector('.minimize-button').getAttribute('class')).toEqual('minimize-button active');
    });
});
//# sourceMappingURL=file-uploading-dialog.component.spec.js.map