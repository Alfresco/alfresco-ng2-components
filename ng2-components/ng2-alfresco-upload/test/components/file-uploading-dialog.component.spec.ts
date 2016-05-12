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


import { it, describe, expect, injectAsync, TestComponentBuilder } from 'angular2/testing';
import { FileUploadingDialogComponent } from '../../src/components/file-uploading-dialog.component';

describe('FileUploadDialog', () => {

    it('should render dialog box with css class show', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(FileUploadingDialogComponent)
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

