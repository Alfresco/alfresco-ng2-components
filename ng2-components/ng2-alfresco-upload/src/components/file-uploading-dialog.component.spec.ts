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

import { describe, it, expect } from '@angular/core/testing';

describe('FileUploadDialog', () => {
   it ('should be migrated to angular 2 rc.1', () => {
       expect(false).toBe(true);
   });
});

/*
import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { it, describe, expect, injectAsync, beforeEachProviders, TestComponentBuilder, setBaseTestProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { TranslationMock } from '../assets/translation.service.mock';

describe('FileUploadDialog', () => {

    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    beforeEachProviders(() => {
        return [
            provide(AlfrescoTranslationService, {useClass: TranslationMock})
        ];
    });

    it('should render dialog box with css class show', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(FileUploadingDialogComponent)
            .then((fixture) => {
                let fileFake = {
                    id: 'fake-id',
                    name: 'fake-name'
                };
                let file = new FileModel(fileFake);
                let component = fixture.componentInstance;
                component.filesUploadingList = [file];

                let compiled = fixture.debugElement.nativeElement;
                component.showDialog();
                fixture.detectChanges();

                expect(compiled.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
            });
    }));
});
*/
