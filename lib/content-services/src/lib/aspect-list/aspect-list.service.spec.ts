/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { setupTestBed } from 'core';
import { of, Subject } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { AspectListService } from './aspect-list.service';

describe('AspectListService', () => {

    let service: AspectListService;
    let materialDialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let spyOnDialogClose: jasmine.Spy;
    const afterOpenObservable: Subject<any> = new Subject();

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule,
            MatDialogModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(AspectListService);
        materialDialog = TestBed.inject(MatDialog);
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
            afterOpen: () => afterOpenObservable,
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        });
        spyOnDialogClose = spyOn(materialDialog, 'closeAll');
    });

    it('should open the aspect list dialog', () => {
        service.openAspectListDialog();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    });

    it('should close the dialog', () => {
        service.close();
        expect(spyOnDialogClose).toHaveBeenCalled();
    });

});
