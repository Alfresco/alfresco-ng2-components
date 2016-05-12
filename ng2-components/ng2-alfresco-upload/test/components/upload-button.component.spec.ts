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


import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { it, describe, expect, injectAsync, beforeEachProviders, TestComponentBuilder, setBaseTestProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { UploadButtonComponent } from '../../../src/components/upload-button.component';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { TranslationMock } from '../assets/translation.service.mock';

describe('AlfrescoUploadButton', () => {

  setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

  beforeEachProviders(() => {
    return [
      provide(TranslateService, {useClass: TranslationMock})
    ];
  });

  it('should render upload-single-file button as default', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UploadButtonComponent)
      .then((fixture) => {
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file')).toBeDefined();
      });
  }));

  it('should render upload-multiple-file button if multipleFiles=true', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UploadButtonComponent)
      .then((fixture) => {
        let component = fixture.componentInstance;
        component.multipleFiles = true;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-files')).toBeDefined();
      });
  }));

  it('should render an uploadFolder button if uploadFolder is true', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UploadButtonComponent)
      .then((fixture) => {
        let component = fixture.componentInstance;
        component.uploadFolder = true;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder')).toBeDefined();
      });
  }));

  it('should call onFilesAdded method', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UploadButtonComponent)
      .then((fixture) => {
        let component = fixture.componentInstance;
        component.onFilesAdded = jasmine.createSpy('onFilesAdded');

        fixture.detectChanges();

        let fakeEvent = {
          currentTarget: {files: [{name: 'fake-name', size: 10}]}
        };

        component.onFilesAdded(fakeEvent);
        expect(component.onFilesAdded).toHaveBeenCalledWith(fakeEvent);
      });
  }));

  it('should render dialog box with css class show ', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UploadButtonComponent)
      .then((fixture) => {
        let component = fixture.componentInstance;
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;

        component._showDialog();
        fixture.detectChanges();
        expect(compiled.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
      });
  }));
});

