/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { DialogAspectListService } from '@alfresco/adf-content-services';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

describe('DialogAspectListService', () => {
    let dialogAspectListService: DialogAspectListService;
    let dialog: MatDialog;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        dialogAspectListService = TestBed.inject(DialogAspectListService);
        dialog = TestBed.inject(MatDialog);
    });

    describe('openAspectListDialog', () => {
        const elementToFocusSelector = 'button';

        it('should focus element indicated by passed selector after closing modal', () => {
            const afterClosed$ = new Subject<void>();
            spyOn(dialog, 'open').and.returnValue({
                afterClosed: () => afterClosed$.asObservable()
            } as MatDialogRef<any>);
            const elementToFocus = document.createElement(elementToFocusSelector);
            spyOn(elementToFocus, 'focus');
            spyOn(document, 'querySelector').withArgs(elementToFocusSelector).and.returnValue(elementToFocus);
            dialogAspectListService.openAspectListDialog('some-node-id', elementToFocusSelector);
            afterClosed$.next();
            expect(elementToFocus.focus).toHaveBeenCalled();
        });

        it('should not focus element indicated by passed selector if modal is not closed', () => {
            const elementToFocus = document.createElement(elementToFocusSelector);
            spyOn(elementToFocus, 'focus');
            spyOn(document, 'querySelector').withArgs(elementToFocusSelector).and.returnValue(elementToFocus);
            dialogAspectListService.openAspectListDialog('some-node-id', elementToFocusSelector);
            expect(elementToFocus.focus).not.toHaveBeenCalled();
        });

        it('should not looking for element to focus if passed selector is empty string', () => {
            const afterClosed$ = new Subject<void>();
            spyOn(dialog, 'open').and.returnValue({
                afterClosed: () => afterClosed$.asObservable()
            } as MatDialogRef<any>);
            spyOn(document, 'querySelector');
            dialogAspectListService.openAspectListDialog('some-node-id', '');
            afterClosed$.next();
            expect(document.querySelector).not.toHaveBeenCalled();
        });
    });
});
