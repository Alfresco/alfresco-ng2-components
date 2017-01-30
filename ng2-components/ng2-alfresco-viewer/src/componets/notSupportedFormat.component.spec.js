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
var notSupportedFormat_component_1 = require("./notSupportedFormat.component");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('Test ng2-alfresco-viewer Not Supported Format View component', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [notSupportedFormat_component_1.NotSupportedFormat],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(notSupportedFormat_component_1.NotSupportedFormat);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    describe('View', function () {
        it('Download button should be present', function () {
            expect(element.querySelector('#viewer-download-button')).not.toBeNull();
        });
        it('should display the name of the file', function () {
            component.nameFile = 'Example Content.xls';
            fixture.detectChanges();
            expect(element.querySelector('h4 span').innerHTML).toEqual('Example Content.xls');
        });
    });
    describe('User Interaction', function () {
        it('Click on Download button should call download method', function () {
            spyOn(window, 'open');
            var downloadButton = element.querySelector('#viewer-download-button');
            downloadButton.click();
            expect(window.open).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=notSupportedFormat.component.spec.js.map