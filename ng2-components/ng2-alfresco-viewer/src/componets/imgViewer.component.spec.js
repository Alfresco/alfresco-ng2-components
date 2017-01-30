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
var imgViewer_component_1 = require("./imgViewer.component");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('Test ng2-alfresco-viewer Img viewer component ', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [imgViewer_component_1.ImgViewerComponent],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(imgViewer_component_1.ImgViewerComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('If no url is passed should thrown an error', function () {
        expect(function () {
            component.ngOnChanges();
        }).toThrow(new Error('Attribute urlFile is required'));
    });
    it('If  url is passed should not thrown an error', function () {
        component.urlFile = 'fake-url';
        expect(function () {
            component.ngOnChanges();
        }).not.toThrow(new Error('Attribute urlFile is required'));
    });
    it('The file Name should be present in the alt attribute', function () {
        component.nameFile = 'fake-name';
        fixture.detectChanges();
        expect(element.querySelector('#viewer-image').getAttribute('alt')).toEqual('fake-name');
    });
});
//# sourceMappingURL=imgViewer.component.spec.js.map